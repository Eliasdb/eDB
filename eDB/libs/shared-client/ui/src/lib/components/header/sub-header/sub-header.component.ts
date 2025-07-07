import { Component, EventEmitter, Output, input, model } from '@angular/core';
import { UiIconButtonComponent } from '../../buttons/icon-button/icon-button.component';

interface OrderItem {
  id: number;
  bookId: number;
  selectedAmount: number;
  price: number; // You might convert the string to a number if necessary.
  book: Book;
}

export interface Book {
  id: number;
  photoUrl: string;
  genre: string;
  description: string;
  title: string;
  price: number;
  stock: number;
  author: string;
  status: string;
  publishedDate: string;
}

@Component({
  selector: 'ui-platform-subheader',
  standalone: true,
  imports: [UiIconButtonComponent],
  template: `
    <header
      class="fixed inset-x-0 top-20 z-50 flex items-center justify-end
             px-6 py-6 pb-12 border-b border-gray-200 bg-white"
    >
      <!-- Cart button – offset from top/left so the slide-in panel clears it -->
      <div class="relative">
        <ui-icon-button
          icon="faShoppingCart"
          [description]="'View cart'"
          [iconSize]="'16px'"
          [iconColor]="'var(--accent)'"
          (click)="toggleCart()"
          class="hover:scale-105 transition-transform"
        ></ui-icon-button>

        <!-- Badge -->
        @if (cartItems()?.length) {
          <span
            class="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center
                   rounded-full bg-red-500 text-xs font-medium text-white shadow-sm"
          >
            {{ cartItems()?.length }}
          </span>
        }
      </div>
    </header>
  `,
})
export class UiPlatformSubHeaderComponent {
  readonly cartItems = input<OrderItem[]>();
  isDialogOpen = model<boolean>(false);

  @Output() openDialog = new EventEmitter<boolean>();

  toggleCart() {
    const next = !this.isDialogOpen();
    this.isDialogOpen.set(next);
    this.openDialog.emit(next);
  }
}
