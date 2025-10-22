export type MenuCategory = 'pizza' | 'kebab' | 'sides' | 'drinks';

export interface MenuItem extends Record<string, unknown> {
  id: string;
  name: string;
  category: MenuCategory;
  price: number;
  description: string;
  tags: string[];
  spicy: boolean;
  vegetarian: boolean;
  readyInMinutes: number;
}

export interface ServiceModeOption {
  value: string;
  label: string;
}

export interface AgentTimelineItem extends Record<string, unknown> {
  id: string;
  speaker: 'Agent Izmir' | 'Cashier' | string;
  text: string;
  tone: 'friendly' | 'neutral' | 'success' | 'alert';
}

export interface OrderRow extends Record<string, unknown> {
  id: string;
  name: string;
  quantity: number;
  price: number;
}
