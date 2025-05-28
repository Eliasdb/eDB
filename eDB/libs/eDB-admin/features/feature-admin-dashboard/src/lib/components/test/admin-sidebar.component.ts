import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'admin-sidebar',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, CommonModule],
  template: `
    <nav class=" w-[16rem] bg-gray-900 text-white h-full flex flex-col p-4">
      <section class="flex items-start justify-between px-2">
        <!-- Left icon + text block -->
        <div class="flex items-center gap-2">
          <mat-icon class="text-4xl">density_medium</mat-icon>
          <div>
            <div class="text-sm font-semibold text-white">eDB</div>
            <div class="text-xs leading-[0.5rem] text-gray-400">Enterprise</div>
          </div>
        </div>

        <!-- Right star icon -->
        <button
          mat-icon-button
          (click)="toggleSidebar.emit()"
          aria-label="Toggle sidebar"
          class="self-end mb-4 bg-transparent"
        >
          <mat-icon>{{ isOpen ? 'chevron_left' : 'chevron_right' }}</mat-icon>
        </button>
      </section>

      <h3 class="text-xs mb-2">Admin Sidebar</h3>
      <ul class="flex-1 space-y-2">
        <li
          class="flex items-center py-1 cursor-pointer"
          (click)="onSelect('platform')"
        >
          <mat-icon>dashboard</mat-icon>
          <span>Platform</span>
        </li>
        <li
          class="flex items-center py-1 cursor-pointer"
          (click)="onSelect('webshop')"
        >
          <mat-icon>storefront</mat-icon>
          <span>Webshop</span>
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
