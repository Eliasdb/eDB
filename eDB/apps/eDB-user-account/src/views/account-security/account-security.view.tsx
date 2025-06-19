// Hooks
import { useEffect, useState } from 'react';

// Components
import { OtpDevicesSection } from './components/otp-devices.section';
import { PasswordSettingsSection } from './components/password.section';
import { SessionDevicesSection } from './components/session-devices.section';

// Services
import { deleteOtpDevice, fetchOtpDevices } from '../../services/totp-service';
import {
  fetchPasswordMeta,
  fetchUserSessions,
  revokeSession,
} from '../../services/user-service';

// Types
import { OtpCred, SessionInfo } from '../../types/types';

export function AccountSecurityView({ token }: { token: string | null }) {
  /* password form -------------------------------------------------------- */
  const [pwdCreated, setPwdCreated] = useState<Date | null>(null);

  /* existing OTP devices ------------------------------------------------- */
  const [devices, setDevices] = useState<OtpCred[]>([]);
  const [sessions, setSessions] = useState<SessionInfo[]>([]);

  /* initial fetch -------------------------------------------------------- */
  useEffect(() => {
    if (!token) return;

    Promise.all([
      fetchOtpDevices(token).then(setDevices),
      fetchPasswordMeta(token).then((ts) => ts && setPwdCreated(new Date(ts))),
      fetchUserSessions(token).then(setSessions).catch(console.error),
    ]).catch(console.error);
  }, [token]);

  /* handlers ------------------------------------------------------------- */
  async function handleDelete(id: string) {
    if (!token) return;

    try {
      await deleteOtpDevice(token, id);
      setDevices((prev) => prev.filter((d) => d.id !== id));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      alert('Delete failed: ' + message);
    }
  }

  async function handleRevokeSession(id: string) {
    if (!token) return;

    try {
      await revokeSession(id, token);
      alert('Session signed out');
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      alert(message);
    }
  }

  return (
    <section className="rounded-xl bg-muted/50 space-y-6">
      <h2 className="text-xl mb-8">Account Security</h2>

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

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-16">
        <OtpDevicesSection devices={devices} onDelete={handleDelete} />
        <SessionDevicesSection
          sessions={sessions}
          onRevoke={handleRevokeSession}
        />
      </section>

      {/* 
      Uncomment if TOTP setup UI is needed later
      
      {totp && (
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
      )}
      */}
    </section>
  );
}
