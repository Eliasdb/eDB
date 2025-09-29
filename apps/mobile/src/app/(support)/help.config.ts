// apps/mobile/src/app/(features)/profile/help.config.ts
import { Ionicons } from '@expo/vector-icons';

export type GuideSection = {
  title: string;
  bullets: string[];
};

export type FaqItem = { q: string; a: string };

export type ContactLink = {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  onPress: () => void;
};

export const GUIDE_SECTIONS: GuideSection[] = [
  {
    title: 'Getting started',
    bullets: [
      'Open the chat tab and start typing—or tap the mic to talk.',
      'Clara can create, update and delete tasks and contacts via built-in tools.',
      'See everything Clara did in Admin → Logs.',
    ],
  },
  {
    title: 'Voice & Realtime',
    bullets: [
      'Choose a voice under Profile → Voice mode.',
      'Clara uses OpenAI Realtime with server VAD to detect when you talk and reply.',
      'If audio is silent on web, ensure the page has playback permission and volume is up.',
    ],
  },
  {
    title: 'Tools & Permissions',
    bullets: [
      'Tools are listed in Admin → Capabilities with parameters.',
      'Every execution is logged—duration, inputs, outputs, and any errors.',
      'Disable integrations you don’t want in Profile → Integrations.',
    ],
  },
  {
    title: 'Privacy & data',
    bullets: [
      'Exports and deletion live in Profile → Security.',
      'We keep a thin audit trail (tools & outcomes) so you can review what happened.',
      'Contact us for DSRs (access, rectification, erasure).',
    ],
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: 'Why can’t I hear the voice reply?',
    a: 'On the web, browsers may block auto-play until you interact. Click anywhere, ensure your output device and tab volume are enabled, then try again.',
  },
  {
    q: 'How do I change Clara’s voice?',
    a: 'Go to Profile → Voice mode and pick a voice. The Realtime session uses that selection for subsequent calls.',
  },
  {
    q: 'Where can I see what Clara did?',
    a: 'Open Admin → Logs for a card or terminal view of every tool run—inputs, outputs, timing and any errors.',
  },
  {
    q: 'Can I disable certain tools?',
    a: 'Yes—visit Profile → Integrations to turn off platforms you do not want Clara to access.',
  },
];

export const CONTACT_LINKS: ContactLink[] = [
  {
    label: 'Email support',
    icon: 'mail-outline',
    onPress: () => window.open?.('mailto:support@claralabs.example') ?? null,
  },
  {
    label: 'Status page',
    icon: 'pulse-outline',
    onPress: () =>
      window.open?.('https://status.example.com', '_blank') ?? null,
  },
  {
    label: 'Developer docs',
    icon: 'code-slash-outline',
    onPress: () => window.open?.('https://docs.example.com', '_blank') ?? null,
  },
];
