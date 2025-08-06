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
import { CartItem } from '@edb/shared-types';
import { UiIconButtonComponent } from '@edb/shared-ui';
import { filter } from 'rxjs';

@Component({
  selector: 'ui-platform-subheader',
  imports: [UiIconButtonComponent, RouterLink],
  template: `
    <header
      class="fixed inset-x-0 top-20 z-50 border-b border-gray-200 bg-white py-6"
    >
      <div
        class="max-w-[100%] px-6 xl:px-0 xl:max-w-[82%] mx-auto flex items-center justify-between w-full"
      >
        <!-- Left: Title + Back Button -->
        <div class="flex items-center gap-6">
          @if (isOnCatalog()) {
            <h1 class="text-lg font-semibold text-slate-800">Demo Webshop</h1>
          } @else {
            <a
              routerLink="/webshop"
              class="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors
             py-1 rounded-lg hover:bg-slate-100"
            >
              ← Back to Catalog
            </a>
          }
        </div>

        <!-- Right: Cart + Orders -->
        <div class="flex items-center gap-4">
          <!-- AI Mode toggle -->
          <ui-icon-button
            icon="faMagicWandSparkles"
            [description]="'Toggle AI Mode'"
            [iconSize]="'16px'"
            [iconColor]="'var(--accent)'"
            (click)="onAiToggleClick()"
            class="hover:scale-105 transition-transform"
          />

          <div class="relative">
            <ui-icon-button
              icon="faHeart"
              [description]="'View wishlist'"
              [iconSize]="'16px'"
              [iconColor]="'var(--accent)'"
              (iconButtonClick)="onWishlistClick()"
              class="hover:scale-105 transition-transform"
            />
            <!-- Optional badge (e.g., if you want to show a count later) -->
            <!--
  @if (wishlistCount() > 0) {
    <span
      class="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center
             rounded-full bg-pink-500 text-xs font-medium text-white shadow-sm"
    >
      {{ wishlistCount() }}
    </span>
  }
  -->
          </div>

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
            @if (orderCount()) {
              <span
                class="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center
                       rounded-full bg-blue-600 text-xs font-medium text-white shadow-sm"
              >
                {{ orderCount() }}
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

          <!-- Wishlist icon -->
        </div>
      </div>
    </header>
  `,
})
export class UiPlatformSubHeaderComponent {
  readonly cartItems = input<CartItem[]>();
  readonly orderCount = input<number>();

  readonly isDialogOpen = model(false);

  @Output() openDialog = new EventEmitter<boolean>();
  @Output() ordersClick = new EventEmitter<void>();
  @Output() wishlistClick = new EventEmitter<void>();

  private router = inject(Router);
  private currentUrl = signal(this.router.url);

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((event) => this.currentUrl.set(event.urlAfterRedirects));
  }

  isOnCatalog = computed(() => {
    const url = this.currentUrl();
    const path = url.split('?')[0]; // strip query params
    return path === '/webshop';
  });

  toggleCart() {
    const next = !this.isDialogOpen();
    this.isDialogOpen.set(next);
    this.openDialog.emit(next);
  }

  onOrdersClick() {
    this.ordersClick.emit();
  }

  onWishlistClick() {
    this.wishlistClick.emit();
  }

  @Output() aiToggleClick = new EventEmitter<void>();

  onAiToggleClick() {
    this.aiToggleClick.emit();
  }
}
