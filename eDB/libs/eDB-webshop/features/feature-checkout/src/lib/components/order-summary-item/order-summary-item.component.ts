// ─────────────────────────────────────────────────────────────
// order-summary-item.component.ts — use only cds‑skeleton‑placeholder
// ─────────────────────────────────────────────────────────────
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CartItem } from '@eDB-webshop/shared-types';
import { SkeletonModule } from 'carbon-components-angular';

@Component({
  standalone: true,
  selector: 'order-summary-item',
  imports: [CommonModule, SkeletonModule],
  template: `
    @if (skeleton) {
      <!-- Skeleton row: cover · title/qty · price -->
      <div class="flex items-center justify-between mb-4 min-h-[4.5rem]">
        <div class="flex items-center space-x-4 flex-1]">
          <!-- cover -->
          <cds-skeleton-placeholder
            class="h-14 w-10 rounded-lg flex-shrink-0"
          ></cds-skeleton-placeholder>

          <!-- title + qty stacked: widths approximate final text length -->
          <div class="flex flex-col gap-6">
            <cds-skeleton-placeholder
              class="h-4 w-48 rounded"
            ></cds-skeleton-placeholder>
            <cds-skeleton-placeholder
              class="h-3 w-12 rounded"
            ></cds-skeleton-placeholder>
          </div>
        </div>
        <!-- price (same width as ~6‑digit currency) -->
        <cds-skeleton-placeholder
          class="h-4 w-20 rounded flex-shrink-0"
        ></cds-skeleton-placeholder>
      </div>
    } @else {
      <!-- Real cart row -->
      <div class="flex items-center justify-between min-h-[4.5rem]">
        <div class="flex items-center space-x-4 flex-1">
          <img
            [src]="item!.book.photoUrl"
            class="h-14 w-10 rounded-lg shadow-md object-cover flex-shrink-0"
          />
          <div>
            <p class="font-medium leading-tight">{{ item!.book.title }}</p>
            <p class="text-sm opacity-80">Qty: {{ item!.selectedAmount }}</p>
          </div>
        </div>
        <p class="font-semibold whitespace-nowrap">
          {{ item!.book.price * item!.selectedAmount | currency: 'EUR' }}
        </p>
      </div>
    }
  `,
})
export class OrderSummaryItemComponent {
  @Input() item?: CartItem; // real cart item when skeleton = false
  @Input() skeleton = false; // true → render placeholders only
}
