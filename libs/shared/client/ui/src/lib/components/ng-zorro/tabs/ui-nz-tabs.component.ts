import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, input } from '@angular/core';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

export type UiNzTabsSize = 'large' | 'default' | 'small';
export type UiNzTabPosition = 'top' | 'bottom' | 'left' | 'right';

export interface UiNzTab {
  key: string;
  label: string;
  description?: string;
  disabled?: boolean;
  content?: string;
}

@Component({
  selector: 'ui-nz-tabs',
  standalone: true,
  imports: [CommonModule, NzTabsModule],
  host: { class: 'block' },
  template: `
    <nz-tabset
      [nzSelectedIndex]="selectedIndex()"
      (nzSelectedIndexChange)="onSelectedIndexChange($event)"
      [nzTabPosition]="tabPosition()"
      [nzAnimated]="animated()"
      [nzSize]="size()"
      class="ui-nz-tabs"
    >
      @for (tab of tabs(); track tab.key) {
        <nz-tab
          [nzTitle]="tab.label"
          [nzDisabled]="tab.disabled ?? false"
          class="ui-nz-tabs__tab"
        >
          <ng-template nz-tab>
            <div class="py-4">
              @if (tab.description) {
                <p class="mb-2 text-sm text-slate-500">
                  {{ tab.description }}
                </p>
              }
              @if (tab.content) {
                <p class="text-sm text-slate-700">{{ tab.content }}</p>
              }
            </div>
          </ng-template>
        </nz-tab>
      }
    </nz-tabset>
  `,
  styles: [
    `
      :host ::ng-deep .ui-nz-tabs.ant-tabs {
        --tab-active: theme(colors.emerald.400);
        --tab-muted: theme(colors.slate.300);
        --tab-bg: theme(colors.slate.900 / 0.6);
        --tab-hover: theme(colors.slate.800 / 0.8);
      }

      :host ::ng-deep .ui-nz-tabs.ant-tabs .ant-tabs-nav {
        @apply m-0 rounded-full bg-[var(--tab-bg)] px-2 py-1;
      }

      :host ::ng-deep .ui-nz-tabs.ant-tabs .ant-tabs-tab {
        @apply rounded-full px-3 py-2 text-sm font-semibold text-[var(--tab-muted)] transition;
      }

      :host ::ng-deep .ui-nz-tabs.ant-tabs .ant-tabs-tab:hover {
        @apply bg-[var(--tab-hover)] text-white;
      }

      :host ::ng-deep .ui-nz-tabs.ant-tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
        @apply text-slate-950;
      }

      :host ::ng-deep .ui-nz-tabs.ant-tabs .ant-tabs-tab.ant-tabs-tab-active {
        @apply bg-[var(--tab-active)] shadow-lg shadow-emerald-500/30;
      }

      :host ::ng-deep .ui-nz-tabs.ant-tabs .ant-tabs-ink-bar {
        @apply hidden;
      }
    `,
  ],
})
export class UiNzTabsComponent {
  readonly tabs = input<UiNzTab[]>([]);
  readonly selectedIndex = input<number>(0);
  readonly tabPosition = input<UiNzTabPosition>('top');
  readonly animated = input<boolean>(true);
  readonly size = input<UiNzTabsSize>('default');

  @Output() readonly selectedIndexChange = new EventEmitter<number>();

  onSelectedIndexChange(index: number): void {
    this.selectedIndexChange.emit(index);
  }
}
