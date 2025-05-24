// lib/sample-data.ts
import { Frame, GalleryVerticalEnd, Map, ShieldCheck } from 'lucide-react';

export const sampleData = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'eDB',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
  ],
  navMain: [
    {
      title: 'Personal Info',
      url: '#',
      icon: Frame,
    },
    {
      title: 'Account Security',
      url: '#',
      icon: ShieldCheck,
      // items: [
      //   { title: 'Genesis', url: '#' },
      //   { title: 'Explorer', url: '#' },
      //   { title: 'Quantum', url: '#' },
      // ],
    },
    {
      title: 'Applications',
      url: '#',
      icon: Map,
      // items: [
      //   { title: 'Introduction', url: '#' },
      //   { title: 'Get Started', url: '#' },
      //   { title: 'Tutorials', url: '#' },
      //   { title: 'Changelog', url: '#' },
      // ],
    },
    {
      // title: 'Settings',
      // url: '#',
      // icon: Settings2,
      // items: [
      //   { title: 'General', url: '#' },
      //   { title: 'Team', url: '#' },
      //   { title: 'Billing', url: '#' },
      //   { title: 'Limits', url: '#' },
      // ],
    },
  ],
  projects: [
    { name: 'Personal Info', url: '#', icon: Frame },
    { name: 'Account Security', url: '#', icon: ShieldCheck },
    { name: 'Applications', url: '#', icon: Map },
  ],
};
