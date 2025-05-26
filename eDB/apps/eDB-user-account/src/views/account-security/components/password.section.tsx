import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Checkbox } from '../../../components/ui/checkbox';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Separator } from '../../../components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../../../components/ui/sheet';
import { changePassword } from '../../../services/user-service';

type Props = {
  token: string | null;
  pwdCreated: Date | null;
  onSuccess?: () => void;
};

export function PasswordSettingsSection({
  token,
  pwdCreated,
  onSuccess,
}: Props) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [signOutOthers, setSignOutOthers] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

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
      if (onSuccess) onSuccess();
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <>
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
          <p className="text-sm">
            {pwdCreated ? (
              <>
                Created{' '}
                {pwdCreated.toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}{' '}
                at{' '}
                {pwdCreated.toLocaleTimeString([], {
                  hour: 'numeric',
                  minute: '2-digit',
                })}
                .
              </>
            ) : (
              'Password metadata unavailable.'
            )}
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
    </>
  );
}
