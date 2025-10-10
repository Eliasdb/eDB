// apps/mobile/src/features/profile/config/security-sections.ts
import type { SettingsRowProps } from '@ui/composites';

export type SecuritySection = {
  key: string;
  title: string;
  rows: SettingsRowProps[];
};

export function getSecuritySections({
  twoFA,
  setTwoFA,
  passkeys,
  setPasskeys,
  router,
}: {
  twoFA: boolean;
  setTwoFA: (v: boolean) => void;
  passkeys: boolean;
  setPasskeys: (v: boolean) => void;
  router: any;
}): SecuritySection[] {
  return [
    {
      key: 'auth',
      title: 'Authentication',
      rows: [
        {
          kind: 'item',
          border: true,
          borderPosition: 'bottom',
          label: 'Change password',
          icon: 'key-outline',
          onPress: () => router.push('/profile/security/change-password'),
        },
        {
          kind: 'toggle',
          border: true,
          borderPosition: 'bottom',
          label: 'Two-factor authentication (2FA)',
          icon: 'shield-checkmark-outline',
          value: twoFA,
          onValueChange: setTwoFA,
        },
        {
          kind: 'toggle',
          label: 'Passkeys (WebAuthn)',
          icon: 'finger-print-outline',
          value: passkeys,
          onValueChange: setPasskeys,
        },
      ],
    },
    {
      key: 'privacy',
      title: 'Privacy & data',
      rows: [
        {
          kind: 'item',
          border: true,
          borderPosition: 'bottom',
          label: 'Export my data',
          icon: 'download-outline',
          onPress: () => {},
        },
        {
          kind: 'item',
          label: 'Delete account',
          icon: 'trash-outline',
          onPress: () => router.push('/profile/security/delete-account'),
        },
      ],
    },
  ];
}
