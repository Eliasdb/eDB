// Hooks
import { useEffect, useState } from 'react';

// Components
import { OtpDevicesSection } from './components/otp-devices.section';
import { PasswordSettingsSection } from './components/password.section';

// Services
import {
  confirmTotpSetup,
  deleteOtpDevice,
  fetchOtpDevices,
  fetchTotpSetup,
} from '../../services/totp-service';
import {
  fetchPasswordMeta,
  fetchUserSessions,
  revokeSession,
} from '../../services/user-service';

// Types
import { OtpCred, SessionInfo } from '../../types/types';
import { SessionDevicesSection } from './components/session-devices.section';

export function AccountSecurityView({ token }: { token: string | null }) {
  /* password form -------------------------------------------------------- */
  const [pwdCreated, setPwdCreated] = useState<Date | null>(null);

  /* TOTP enrolment ------------------------------------------------------- */
  const [totp, setTotp] = useState<{
    secret: string;
    uri: string;
    qrImage: string;
  } | null>(null);
  const [totpCode, setTotpCode] = useState('');
  const [deviceLabel, setDeviceLabel] = useState('');
  const [setupSuccess, setSetupSuccess] = useState(false);

  /* existing OTP devices ------------------------------------------------- */
  const [devices, setDevices] = useState<OtpCred[]>([]);
  const [sessions, setSessions] = useState<SessionInfo[]>([]);

  /* initial fetch */
  useEffect(() => {
    if (!token) return;

    Promise.all([
      fetchOtpDevices(token).then(setDevices),
      fetchPasswordMeta(token).then((ts) => ts && setPwdCreated(new Date(ts))),
      fetchTotpSetup(token).then(setTotp).catch(console.error),
      fetchUserSessions(token).then(setSessions).catch(console.error),
    ]).catch(console.error);
  }, [token]);

  /* handlers ------------------------------------------------------------- */

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

      <PasswordSettingsSection
        token={token}
        pwdCreated={pwdCreated}
        onSuccess={() => {
          // optionally re-fetch password metadata or show success toast
        }}
      />

      <OtpDevicesSection devices={devices} onDelete={handleDelete} />

      <SessionDevicesSection
        sessions={sessions}
        onRevoke={handleRevokeSession}
      />

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
