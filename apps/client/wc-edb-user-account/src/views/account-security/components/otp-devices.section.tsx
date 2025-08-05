'use client';

import { Button } from '../../../components/ui/button';
import { OtpCred } from '../../../types/types';

type Props = {
  devices: OtpCred[];
  onDelete: (id: string) => void;
};

export function OtpDevicesSection({ devices, onDelete }: Props) {
  return (
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
            className="text-blue-600 underline"
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
                onClick={() => onDelete(d.id)}
              >
                Delete
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
