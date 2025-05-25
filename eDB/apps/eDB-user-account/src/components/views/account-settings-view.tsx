'use client';

import * as React from 'react';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';

import {
  confirmTotpSetup,
  deleteOtpDevice,
  fetchOtpDevices,
  fetchTotpSetup,
} from '../lib/totp-service';
import {
  changePassword,
  fetchPasswordMeta,
  fetchUserSessions,
  revokeSession,
  SessionInfo,
} from '../lib/user-service';

type OtpCred = {
  id: string;
  userLabel?: string;
  createdDate?: number;
};

export function AccountSettingsView({ token }: { token: string | null }) {
  /* password form -------------------------------------------------------- */
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [signOutOthers, setSignOutOthers] = React.useState(false);
  const [pwdCreated, setPwdCreated] = React.useState<Date | null>(null);

  /* TOTP enrolment ------------------------------------------------------- */
  const [totp, setTotp] = React.useState<{
    secret: string;
    uri: string;
    qrImage: string;
  } | null>(null);

  const [totpCode, setTotpCode] = React.useState('');
  const [deviceLabel, setDeviceLabel] = React.useState('');
  const [setupSuccess, setSetupSuccess] = React.useState(false);

  // 🔒 Show/hide toggles:
  const [showNewPwd, setShowNewPwd] = React.useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = React.useState(false);

  /* existing OTP devices ------------------------------------------------- */
  const [devices, setDevices] = React.useState<OtpCred[]>([]);

  const [sessions, setSessions] = React.useState<SessionInfo[]>([]);

  /* initial fetch */
  React.useEffect(() => {
    if (!token) return;

    Promise.all([
      fetchOtpDevices(token).then(setDevices),
      fetchPasswordMeta(token).then((ts) => ts && setPwdCreated(new Date(ts))),
      fetchTotpSetup(token).then(setTotp).catch(console.error),
      fetchUserSessions(token).then(setSessions).catch(console.error),
    ]).catch(console.error);
  }, [token]);

  /* handlers ------------------------------------------------------------- */
  async function handleSave() {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (!token) {
      alert('No access token');
      return;
    }

    try {
      const res = await changePassword(newPassword, signOutOthers, token);
      alert(res.message);
      setNewPassword('');
      setConfirmPassword('');
      setSignOutOthers(false);
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function handleTotpSubmit() {
    if (!token) return alert('No access token');

    try {
      await confirmTotpSetup(token, totpCode, deviceLabel || 'My device');
      setSetupSuccess(true);
      setTotpCode('');
      setDeviceLabel('');
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function handleDelete(id: string) {
    if (!token) return;

    try {
      await deleteOtpDevice(token, id);
      setDevices((prev) => prev.filter((d) => d.id !== id));
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  }

  async function handleRevokeSession(id: string) {
    if (!token) return;

    try {
      await revokeSession(id, token);
      alert('Session signed out');
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <section className="rounded-xl bg-muted/50 space-y-6">
      <h2 className="text-xl font-semibold mb-8">Account Security</h2>

      <div className="space-y-1">
        <h3 className="text-base font-medium">Signing in</h3>
        <p className="text-base">Configure ways to sign in.</p>
      </div>

      <Separator />

      <div className="space-y-2">
        <h4 className="text-base font-medium">Basic authentication</h4>
        <p className="text-base">Password</p>
        <p className="text-base">Sign in by entering your password.</p>
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <div>
          <h5 className="text-base font-medium">My password</h5>
          {/* in render — replace hard-coded text */}
          <p className="text-sm ">
            {pwdCreated
              ? `Created ${pwdCreated.toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })} at ${pwdCreated.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}.`
              : 'Password metadata unavailable.'}
          </p>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              Update
            </Button>
          </SheetTrigger>
          <SheetContent className="space-y-6 p-6">
            <SheetHeader>
              <SheetTitle>Update Password</SheetTitle>
            </SheetHeader>

            <div className="space-y-4">
              {/* New Password Field */}
              <div className="relative">
                <Label htmlFor="new-password">New password</Label>
                <Input
                  id="new-password"
                  type={showNewPwd ? 'text' : 'password'}
                  value={newPassword}
                  autoFocus={false}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPwd((v) => !v)}
                  className="absolute h-10 inset-y-0 right-2 top-6 flex items-center text-sm text-gray-500"
                >
                  {showNewPwd ? 'Hide' : 'Show'}
                </button>
              </div>

              {/* Confirm Password Field */}
              <div className="relative">
                <Label htmlFor="confirm-password">Confirm password</Label>
                <Input
                  id="confirm-password"
                  type={showConfirmPwd ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPwd((v) => !v)}
                  className="absolute h-10 inset-y-0 right-2 top-6 flex items-center text-sm text-gray-500"
                >
                  {showConfirmPwd ? 'Hide' : 'Show'}
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sign-out"
                  checked={signOutOthers}
                  onCheckedChange={(val) => setSignOutOthers(Boolean(val))}
                />
                <Label htmlFor="sign-out">Sign out from other devices</Label>
              </div>
            </div>

            <SheetFooter>
              <Button onClick={handleSave}>Save Password</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      <Separator />

      {/* ─────────────────────── OTP DEVICES SECTION ─────────────────────── */}
      <div className="space-y-4">
        <h4 className="text-base font-medium">Mobile Authenticators</h4>

        {devices.length === 0 ? (
          <div className="space-y-2">
            <p className="text-base text-muted-foreground">
              No devices linked yet.
            </p>
            <a
              href={
                `http://localhost:8080/realms/eDB/account` +
                `?kc_action=CONFIGURE_TOTP` +
                `&referrer=account-console` +
                `&referrer_uri=${encodeURIComponent('/realms/eDB/account')}`
              }
              target="_blank"
            >
              Set up authenticator
            </a>
          </div>
        ) : (
          <ul className="space-y-2">
            {devices.map((d) => (
              <li
                key={d.id}
                className="flex items-center justify-between border rounded-lg p-3"
              >
                <div>
                  <p className="font-medium">
                    {d.userLabel || '(unnamed device)'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Added{' '}
                    {d.createdDate
                      ? new Date(d.createdDate).toLocaleString()
                      : '–'}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(d.id)}
                >
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {sessions.length > 0 && (
        <>
          <h4 className="text-base font-medium">Signed-in Devices</h4>{' '}
          <div className="mt-6 p-4 rounded-xl border bg-white/90 shadow-sm space-y-4">
            <ul className="space-y-3">
              {sessions.map((s) => (
                <li key={s.id} className="border rounded p-3 space-y-1 text-sm">
                  <div>
                    <strong>IP:</strong> {s.ipAddress}
                  </div>
                  <div>
                    <strong>Clients:</strong>{' '}
                    {Object.values(s.clients).join(', ')}
                  </div>
                  <div>
                    <strong>Started:</strong>{' '}
                    {new Date(s.start).toLocaleString()}
                  </div>
                  <div>
                    <strong>Last Access:</strong>{' '}
                    {new Date(s.lastAccess).toLocaleString()}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRevokeSession(s.id)}
                  >
                    Sign out this device
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {/* {totp && (
        <div className="mt-6 p-4 rounded-xl border bg-white/90 shadow-sm space-y-4">
          <h4 className="text-sm font-medium">Mobile Authenticator Setup</h4>
          <p className="text-sm text-muted-foreground">
            Scan this QR code with Google Authenticator, FreeOTP, or Microsoft
            Authenticator.
          </p>
          <img
            src={totp.qrImage}
            alt="Authenticator QR Code"
            className="w-48 h-48 mx-auto"
          />
          <p className="text-center text-xs text-muted-foreground mt-2">
            Or manually enter the secret: <code>{totp.secret}</code>
          </p>

          <div className="space-y-2">
            <Label htmlFor="totp-code">One-time code</Label>
            <Input
              id="totp-code"
              type="text"
              maxLength={6}
              value={totpCode}
              onChange={(e) => setTotpCode(e.target.value)}
            />

            <Label htmlFor="device-label">Device label (optional)</Label>
            <Input
              id="device-label"
              type="text"
              value={deviceLabel}
              onChange={(e) => setDeviceLabel(e.target.value)}
            />

            <Button onClick={handleTotpSubmit}>Finish Setup</Button>

            {setupSuccess && (
              <p className="text-green-600 text-sm font-medium mt-2">
                TOTP successfully configured!
              </p>
            )}
          </div>
        </div>
      )} */}
    </section>
  );
}
