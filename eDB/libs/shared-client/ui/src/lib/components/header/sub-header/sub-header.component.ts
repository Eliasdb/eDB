import {
  Component,
  EventEmitter,
  Output,
  computed,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { CartItem } from '@eDB-webshop/shared-types';
import { filter } from 'rxjs';
import { UiIconButtonComponent } from '../../buttons/icon-button/icon-button.component';

interface OrderItem {
  id: number;
  bookId: number;
  selectedAmount: number;
  price: number;
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
  imports: [UiIconButtonComponent, RouterLink],
  template: `
    <header
      class="fixed inset-x-0 top-20 z-50 border-b border-gray-200 bg-white px-6 py-6"
    >
      <div class="flex items-center justify-between w-full">
        <div>
          @if (!isOnCatalog()) {
            <a
              routerLink="/webshop"
              class="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors
                  py-1 rounded-lg hover:bg-slate-100"
            >
              ← Back to Catalog
            </a>
          }
        </div>

        <div class="flex items-center gap-4">
          <!-- Orders icon -->
          <div class="relative">
            <ui-icon-button
              icon="faBoxArchive"
              [description]="'View orders'"
              [iconSize]="'16px'"
              [iconColor]="'var(--accent)'"
              (iconButtonClick)="onOrdersClick()"
              class="hover:scale-105 transition-transform"
            />
            @if (orderItems()?.length) {
              <span
                class="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center
                   rounded-full bg-blue-600 text-xs font-medium text-white shadow-sm"
              >
                {{ orderItems()?.length }}
              </span>
            }
          </div>

          <!-- Cart icon -->
          <div class="relative">
            <ui-icon-button
              icon="faShoppingCart"
              [description]="'View cart'"
              [iconSize]="'16px'"
              [iconColor]="'var(--accent)'"
              (click)="toggleCart()"
              class="hover:scale-105 transition-transform"
            />
            @if (cartItems()?.length) {
              <span
                class="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center
                   rounded-full bg-red-500 text-xs font-medium text-white shadow-sm"
              >
                {{ cartItems()?.length }}
              </span>
            }
          </div>
        </div>
      </div>
    </header>
  `,
})
export class UiPlatformSubHeaderComponent {
  readonly cartItems = input<CartItem[]>();
  readonly orderItems = input<OrderItem[]>();
  readonly isDialogOpen = model(false);

  @Output() openDialog = new EventEmitter<boolean>();
  @Output() ordersClick = new EventEmitter<void>();

  private router = inject(Router);
  private currentUrl = signal(this.router.url);

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((event) => this.currentUrl.set(event.urlAfterRedirects));
  }

  isOnCatalog = computed(() => this.currentUrl() === '/webshop');

  toggleCart() {
    const next = !this.isDialogOpen();
    this.isDialogOpen.set(next);
    this.openDialog.emit(next);
  }

  onOrdersClick() {
    this.ordersClick.emit();
  }
}
