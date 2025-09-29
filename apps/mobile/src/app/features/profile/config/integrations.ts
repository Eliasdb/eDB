// apps/mobile/src/app/features/profile/config/integrations.ts
export type IntegrationItem = {
  key: string;
  label: string;
  icon: React.ComponentProps<
    typeof import('@expo/vector-icons').Ionicons
  >['name'];
};

export type IntegrationSection = {
  key: string;
  title: string;
  items: IntegrationItem[];
};

/**
 * Static sections for now (you can later make this locale-aware and pass `t`).
 * Order here is Mobile order: CRM → Support → Other
 */
export function getIntegrationSections(): IntegrationSection[] {
  return [
    {
      key: 'crm',
      title: 'CRM platforms',
      items: [
        { key: 'hubspot', label: 'HubSpot', icon: 'briefcase-outline' },
        { key: 'salesforce', label: 'Salesforce', icon: 'cloud-outline' },
      ],
    },
    {
      key: 'support',
      title: 'Support & messaging',
      items: [
        {
          key: 'zendesk',
          label: 'Zendesk',
          icon: 'chatbubble-ellipses-outline',
        },
        {
          key: 'intercom',
          label: 'Intercom',
          icon: 'chatbox-ellipses-outline',
        },
      ],
    },
    {
      key: 'other',
      title: 'Other',
      items: [
        { key: 'notion', label: 'Notion', icon: 'layers-outline' },
        { key: 'slack', label: 'Slack', icon: 'logo-slack' },
      ],
    },
  ];
}

/**
 * Which sections go in which column on wide screens.
 * Left column: CRM + Other. Right column: Support.
 */
export function wideColumnLayout(sectionKeys: string[]) {
  const leftKeys = ['crm', 'other'];
  const rightKeys = ['support'];
  const byKey = new Map(sectionKeys.map((k, i) => [k, i]));

  const left = leftKeys
    .map((k) => byKey.get(k))
    .filter((i): i is number => typeof i === 'number');

  const right = rightKeys
    .map((k) => byKey.get(k))
    .filter((i): i is number => typeof i === 'number');

  return { left, right };
}
