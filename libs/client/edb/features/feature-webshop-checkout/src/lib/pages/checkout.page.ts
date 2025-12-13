// ─────────────────────────────────────────────────────────────
// checkout.page.ts — uses skeleton rows until cart loads
// ─────────────────────────────────────────────────────────────
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

// Component Modules
import { CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { SkeletonModule } from 'carbon-components-angular';

// UI
import { UiButtonComponent, UiTextInputComponent } from '@edb/shared-ui';
import { OrderSummaryItemComponent } from '../components/order-summary-item/order-summary-item.component';

// Services & Types
import { CartService } from '@edb/client-cart';
import { CheckoutService, OrderCreateRequest } from '@edb/client-checkout';
import { CartItem } from '@edb/shared-types';

@Component({
  selector: 'app-checkout-page',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    UiTextInputComponent,
    UiButtonComponent,
    OrderSummaryItemComponent,
    SkeletonModule,
    CurrencyPipe,
  ],
  template: `
    <section
      class="min-h-screen bg-gradient-to-r from-slate-50 to-slate-100 py-36 lg:py-[14rem]"
    >
      <div
        class="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2"
      >
        <!-- Summary Pane -->
        <!-- Order Summary Pane -->
        <div class="hidden lg:block relative bg-[var(--accent-complimentary)]">
          <div class="absolute inset-0 flex flex-col text-white p-10 space-y-6">
            <!-- Header -->
            <div>
              <h2 class="text-4xl font-extrabold mb-2">Order Summary</h2>
              <p class="opacity-80 mb-6">
                Review your selected books before checkout.
              </p>
            </div>

            <!-- Scrollable list of items -->
            <div class="flex-1 overflow-y-auto pr-2 space-y-4">
              @if (loading) {
                @for (_ of placeholderRows; track _) {
                  <webshop-order-summary-item
                    [skeleton]="true"
                  ></webshop-order-summary-item>
                }
              } @else {
                @for (item of cartItems; track item.id) {
                  <webshop-order-summary-item
                    [item]="item"
                  ></webshop-order-summary-item>
                }
              }
            </div>

            <!-- Total -->
            <div
              class="border-t border-white/30 pt-4 text-xl font-bold flex justify-between"
            >
              <span>Total</span>
              <span>
                @if (loading) {
                  <cds-skeleton-text width="70px"></cds-skeleton-text>
                } @else {
                  {{ total | currency: 'EUR' }}
                }
              </span>
            </div>
          </div>
        </div>

        <!-- Form Pane -->
        <div class="p-6 md:p-12 lg:p-16 bg-white">
          <h1 class="text-4xl font-bold text-gray-800 mb-2">Checkout</h1>
          <p class="text-gray-500 mb-8">
            Enter your shipping details to complete your purchase.
          </p>
          <form [formGroup]="checkoutForm">
            <div class="mb-6">
              <ui-text-input
                label="Full Name"
                placeholder="John Doe"
                [invalid]="isInvalid('fullName')"
                invalidText="Required"
                formControlName="fullName"
                inputId="fullName"
              ></ui-text-input>
            </div>

            <div class="mb-6">
              <ui-text-input
                label="Address"
                placeholder="123 Main St"
                [invalid]="isInvalid('address')"
                invalidText="Required"
                formControlName="address"
                inputId="address"
              ></ui-text-input>
            </div>

            <div class="grid gap-y-8 gap-x-6 md:grid-cols-2 mb-6">
              <ui-text-input
                label="City"
                placeholder="Metropolis"
                formControlName="city"
                inputId="city"
              ></ui-text-input>
              <ui-text-input
                label="Postal Code"
                placeholder="10001"
                formControlName="postalCode"
                inputId="postalCode"
              ></ui-text-input>
            </div>

            <div class="mb-6">
              <ui-text-input
                label="Email"
                placeholder="john.doe@example.com"
                [invalid]="isInvalid('email')"
                invalidText="Invalid email"
                formControlName="email"
                inputId="email"
              ></ui-text-input>
            </div>

            <!-- Mobile Order Summary -->
            @if (!loading && cartItems.length) {
              <div class="lg:hidden border-t mt-10 space-y-4">
                <h2 class="text-2xl font-bold text-gray-800">Order Summary</h2>
                @for (item of cartItems; track item.id) {
                  <webshop-order-summary-item
                    [item]="item"
                  ></webshop-order-summary-item>
                }
                <div
                  class="flex justify-between font-bold text-lg text-gray-700"
                >
                  <span>Total</span>
                  <span>{{ total | currency: 'EUR' }}</span>
                </div>
              </div>
            }

            <div class="flex justify-end pt-4">
              <ui-button
                size="lg"
                [disabled]="checkoutForm.invalid || loading"
                (buttonClick)="submit()"
              >
                Place Order
              </ui-button>
            </div>
          </form>
        </div>
      </div>
    </section>
  `,
  styles: [],
})
export class CheckoutPageComponent {
  // ───────── dependencies via inject() ─────────
  private readonly fb = inject(FormBuilder);
  private readonly cartService = inject(CartService);
  private readonly checkoutService = inject(CheckoutService);

  // ───────── reactive state ─────────
  readonly placeholderRows = Array.from({ length: 4 });

  // form created with the injected FormBuilder
  checkoutForm = this.fb.group({
    fullName: ['John Doe', Validators.required],
    address: ['123 Main St', Validators.required],
    city: ['Metropolis', Validators.required],
    postalCode: ['10001', Validators.required],
    email: ['john.doe@example.com', [Validators.required, Validators.email]],
  });

  // ───────── template getters ─────────
  get loading(): boolean {
    return this.cartService.isLoading();
  }

  get cartItems(): CartItem[] {
    return this.cartService.cartItems();
  }

  get total(): number {
    const cart = this.cartService.cart();
    return (
      cart?.total ??
      this.cartItems.reduce(
        (sum, item) => sum + item.book.price * item.selectedAmount,
        0,
      )
    );
  }

  // ───────── helpers ─────────
  isInvalid(controlName: string): boolean {
    const control = this.checkoutForm.get(controlName);
    return !!control && control.invalid && control.touched;
  }

  async submit(): Promise<void> {
    if (this.checkoutForm.invalid) return;
    const payload = this.checkoutForm.getRawValue() as OrderCreateRequest;

    try {
      const { url } = await this.checkoutService.submitCheckoutSession(payload);
      window.location.href = url; // redirect to Stripe Checkout
    } catch (e) {
      console.error('❌ Stripe checkout session failed', e);
      // Optionally show error message in UI
    }
  }
}
