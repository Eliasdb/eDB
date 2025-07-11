import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'admin-sidebar',
  imports: [MatIconModule],
  template: `
    <nav class="w-[16rem] bg-gray-900 text-white h-full flex flex-col p-4">
      <section class="flex items-start justify-between pl-2">
        <!-- Left icon + text block -->
        <div class="flex items-center gap-2 mb-8 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-gallery-vertical-end size-4 mr-2 "
            aria-hidden="true"
          >
            <path d="M7 2h10"></path>
            <path d="M5 6h14"></path>
            <rect width="18" height="12" x="3" y="10" rx="2"></rect>
          </svg>
          <div>
            <div class="text-sm font-semibold text-white">eDB</div>
            <div class="text-xs leading-[0.75rem] text-gray-400">
              Enterprise
            </div>
          </div>
        </div>

        <!-- Right star icon -->

        <svg
          xmlns="http://www.w3.org/2000/svg"
          (click)="toggleSidebar.emit()"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-star ml-auto scale-75 mt-1"
          aria-hidden="true"
        >
          <path
            d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"
          ></path>
        </svg>
      </section>

      <h3 class="text-xs mb-2">Admin Sidebar</h3>
      <ul class="flex-1 space-y-1">
        <li
          class="flex items-center py-1 cursor-pointer"
          (click)="onSelect('platform')"
        >
          <mat-icon>dashboard</mat-icon>
          <span class="text-sm">Platform</span>
        </li>
        <li
          class="flex items-center py-1 cursor-pointer"
          (click)="onSelect('webshop')"
        >
          <mat-icon>storefront</mat-icon>
          <span class="text-sm">Webshop</span>
        </li>
      </ul>
    </nav>
  `,
  styles: [],
})
export class AdminSidebarComponent {
  /** Whether drawer is open to choose icon direction */
  @Input() isOpen: boolean = true;
  /** Emits when toggle icon is clicked */
  @Output() toggleSidebar = new EventEmitter<void>();
  /** Emits when a menu item is selected */
  @Output() itemSelected = new EventEmitter<'platform' | 'webshop'>();

  onSelect(item: 'platform' | 'webshop') {
    this.itemSelected.emit(item);
  }
}
