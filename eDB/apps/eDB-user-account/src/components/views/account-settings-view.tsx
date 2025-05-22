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

  function handleSave() {
    // TODO: Call your password update API here
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    alert(
      `Password updated!\nSign out others: ${signOutOthers ? 'Yes' : 'No'}`,
    );

    // Reset fields
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
    </section>
  );
}
