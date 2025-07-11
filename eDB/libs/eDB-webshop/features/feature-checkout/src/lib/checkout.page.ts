// ─────────────────────────────────────────────────────────────
// checkout.page.ts — uses skeleton rows until cart loads
// ─────────────────────────────────────────────────────────────
import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { Cart, CartItem } from '@eDB-webshop/shared-types';
import { UiButtonComponent, UiTextInputComponent } from '@edb/shared-ui';
import { SkeletonModule } from 'carbon-components-angular';
import { CheckoutService } from './checkout.service';
import { OrderSummaryItemComponent } from './components/order-summary-item/order-summary-item.component';

@Component({
  selector: 'app-checkout-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    UiTextInputComponent,
    UiButtonComponent,
    OrderSummaryItemComponent,
    SkeletonModule,
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
                  <order-summary-item [skeleton]="true"></order-summary-item>
                }
              } @else {
                @for (item of cartItems; track item.id) {
                  <order-summary-item [item]="item"></order-summary-item>
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
                  <order-summary-item [item]="item"></order-summary-item>
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

          @if (confirmation()) {
            <div
              class="mt-10 p-6 rounded-2xl bg-green-50 border border-green-200"
            >
              <h3 class="text-2xl font-semibold text-green-700 mb-2">
                Order Confirmed!
              </h3>
              <p>
                Your order <strong>{{ confirmation()?.orderId }}</strong> has
                been placed. Estimated delivery:
                <strong>{{ confirmation()?.estimatedDelivery }}</strong
                >.
              </p>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [],
})
export class CheckoutPageComponent implements OnInit {
  cartItems: CartItem[] = [];
  cart!: Cart;
  loading = true;
  placeholderRows = Array.from({ length: 4 });

  checkoutForm: FormGroup;
  confirmation = signal<any>(null);

  get total(): number {
    return (
      this.cart?.total ??
      this.cartItems.reduce((s, i) => s + i.book.price * i.selectedAmount, 0)
    );
  }

  constructor(
    private checkoutService: CheckoutService,
    private fb: FormBuilder,
  ) {
    this.checkoutForm = this.fb.group({
      fullName: ['John Doe', Validators.required],
      address: ['123 Main St', Validators.required],
      city: ['Metropolis', Validators.required],
      postalCode: ['10001', Validators.required],
      email: ['john.doe@example.com', [Validators.required, Validators.email]],
    });
  }

  async ngOnInit() {
    this.cart = await this.checkoutService.getCart();
    this.cartItems = this.cart.items;
    this.loading = false;
  }

  isInvalid(controlName: string): boolean {
    const control = this.checkoutForm.get(controlName);
    return !!control && control.invalid && control.touched;
  }

  async submit() {
    if (this.checkoutForm.invalid) return;
    const result = await this.checkoutService.submitOrder(
      this.checkoutForm.value,
    );
    this.confirmation.set(result);
  }
}
