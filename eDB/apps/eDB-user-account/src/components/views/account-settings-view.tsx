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

export function AccountSettingsView() {
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [signOutOthers, setSignOutOthers] = React.useState(false);
  const [totp, setTotp] = React.useState<{
    secret: string;
    uri: string;
    qrImage: string;
  } | null>(null);

  React.useEffect(() => {
    fetch('/realms/eDB/totp-setup', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`, // adjust if using a hook/service
      },
    })
      .then((res) => res.json())
      .then((data) => setTotp(data))
      .catch((err) => console.error('TOTP fetch error:', err));
  }, []);

  function handleSave() {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    alert(
      `Password updated!\nSign out others: ${signOutOthers ? 'Yes' : 'No'}`,
    );

    setNewPassword('');
    setConfirmPassword('');
    setSignOutOthers(false);
  }

  return (
    <section className="rounded-xl bg-muted/50 space-y-6">
      <h2 className="text-xl font-semibold mb-8">Account Security</h2>

      <div className="space-y-1">
        <h3 className="text-sm font-medium text-muted-foreground">
          Signing in
        </h3>
        <p className="text-sm">Configure ways to sign in.</p>
      </div>

      <Separator />

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Basic authentication</h4>
        <p className="text-sm text-muted-foreground">Password</p>
        <p className="text-sm">Sign in by entering your password.</p>
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <div>
          <h5 className="text-sm font-medium">My password</h5>
          <p className="text-sm text-muted-foreground">
            Created May 14, 2025 at 3:44 PM.
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
              <div>
                <Label htmlFor="new-password">New password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="confirm-password">Confirm password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
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

      {totp && (
        <div className="mt-6 p-4 rounded-xl border bg-white/90 shadow-sm">
          <h4 className="text-sm font-medium mb-2">
            Mobile Authenticator Setup
          </h4>
          <p className="text-sm text-muted-foreground mb-4">
            Scan this QR code with Google Authenticator, FreeOTP, or Microsoft
            Authenticator.
          </p>
          <img
            src={totp.qrImage}
            alt="Authenticator QR Code"
            className="w-48 h-48 mx-auto"
          />
          <p className="text-center text-xs text-muted-foreground mt-4">
            Or manually enter the secret: <code>{totp.secret}</code>
          </p>
        </div>
      )}
    </section>
  );
}
