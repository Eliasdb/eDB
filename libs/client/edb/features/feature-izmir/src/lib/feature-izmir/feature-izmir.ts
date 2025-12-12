import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  signal,
} from '@angular/core';
import {
  UiNzButtonComponent,
  UiNzCardComponent,
  UiNzCheckboxComponent,
  UiNzSelectComponent,
  UiNzSwitchComponent,
  UiNzTableComponent,
  UiNzTabsComponent,
  type UiNzTableColumn,
} from '@edb/shared-ui';
import {
  AGENT_TIMELINE,
  MENU_ITEMS,
  SERVICE_MODES,
} from '../data/menu.data';
import type {
  MenuItem,
  OrderRow,
  ServiceModeOption,
} from '../models/menu-item.model';

const MENU_TABS: Array<{
  key: string;
  label: string;
  description: string;
}> = [
  {
    key: 'pizza',
    label: 'Stone Baked Pizzas',
    description: 'Wood-fired pide & lahmacun fired to order.',
  },
  {
    key: 'kebab',
    label: 'Charcoal Kebabs',
    description: 'Adana, tavuk, and rotating charcoal specials.',
  },
  {
    key: 'sides',
    label: 'Sides & Mezze',
    description: 'Starters, dips, and plant-forward mezze trays.',
  },
  {
    key: 'drinks',
    label: 'Drinks',
    description: 'Cooling ayran and house-made şalgam.',
  },
];

@Component({
  selector: 'lib-feature-izmir',
  standalone: true,
  imports: [
    CommonModule,
    UiNzButtonComponent,
    UiNzCardComponent,
    UiNzCheckboxComponent,
    UiNzSelectComponent,
    UiNzSwitchComponent,
    UiNzTableComponent,
    UiNzTabsComponent,
  ],
  templateUrl: './feature-izmir.html',
  styleUrls: ['./feature-izmir.css'],
})
export class FeatureIzmirComponent {
  readonly tabs = MENU_TABS;

  readonly selectedTabIndex = signal(0);
  readonly selectedTab = computed(() => this.tabs[this.selectedTabIndex()]);

  readonly serviceMode = signal<string>(SERVICE_MODES[0].value);
  readonly prioritizeSpicy = signal(false);
  readonly vegetarianOnly = signal(false);
  readonly rushMode = signal(false);

  readonly menu = signal<MenuItem[]>(MENU_ITEMS);
  readonly orderItems = signal<OrderRow[]>([]);

  readonly filteredMenu = computed(() => {
    const categoryKey = this.selectedTab().key;

    return this.menu().filter((item) => {
      if (item.category !== categoryKey) {
        return false;
      }
      if (this.prioritizeSpicy() && !item.spicy) {
        return false;
      }
      if (this.vegetarianOnly() && !item.vegetarian) {
        return false;
      }
      if (this.rushMode() && item.readyInMinutes > 12) {
        return false;
      }
      return true;
    });
  });

  readonly orderRows = computed(() => this.orderItems());
  readonly orderTotal = computed(() =>
    this.orderItems().reduce(
      (total, row) => total + row.price * row.quantity,
      0,
    ),
  );

  readonly serviceModeOptions: ServiceModeOption[] = SERVICE_MODES;
  readonly agentTimeline = AGENT_TIMELINE;
  readonly orderColumns: UiNzTableColumn<OrderRow>[] = [
    { key: 'name', title: 'Item' },
    { key: 'quantity', title: 'Qty', align: 'center' },
    {
      key: 'price',
      title: 'Line Total',
      align: 'right',
      render: (row) => `€${(row.price * row.quantity).toFixed(2)}`,
    },
  ];

  updateTab(index: number): void {
    this.selectedTabIndex.set(index);
  }

  onServiceModeChange(
    mode: string | number | Array<string | number> | null,
  ): void {
    if (typeof mode === 'string') {
      this.serviceMode.set(mode);
    } else if (Array.isArray(mode)) {
      const value = mode[0];
      if (typeof value === 'string') {
        this.serviceMode.set(value);
      }
    }
  }

  onToggleRush(value: boolean): void {
    this.rushMode.set(value);
  }

  onToggleSpicy(value: boolean): void {
    this.prioritizeSpicy.set(value);
  }

  onToggleVegetarian(value: boolean): void {
    this.vegetarianOnly.set(value);
  }

  addToOrder(item: MenuItem): void {
    const existing = this.orderItems().find((row) => row.id === item.id);
    if (existing) {
      this.orderItems.update((rows) =>
        rows.map((row) =>
          row.id === item.id
            ? { ...row, quantity: row.quantity + 1 }
            : row,
        ),
      );
    } else {
      this.orderItems.update((rows) => [
        ...rows,
        {
          id: item.id,
          name: item.name,
          quantity: 1,
          price: item.price,
        },
      ]);
    }
  }

  removeFromOrder(id: string): void {
    this.orderItems.update((rows) =>
      rows
        .map((row) =>
          row.id === id
            ? { ...row, quantity: Math.max(0, row.quantity - 1) }
            : row,
        )
        .filter((row) => row.quantity > 0),
    );
  }

  clearOrder(): void {
    this.orderItems.set([]);
  }

  resetFilters(): void {
    this.rushMode.set(false);
    this.vegetarianOnly.set(false);
    this.prioritizeSpicy.set(false);
  }

  formatCurrency(value: number): string {
    return `€${value.toFixed(2)}`;
  }

  hasInOrder(id: string): boolean {
    return this.orderItems().some((row) => row.id === id);
  }

  serviceModeLabel(value: string = this.serviceMode()): string {
    const mode = this.serviceModeOptions.find(
      (option) => option.value === value,
    );
    return mode?.label ?? '';
  }
}
