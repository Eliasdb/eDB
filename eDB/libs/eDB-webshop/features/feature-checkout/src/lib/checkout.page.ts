// ─────────────────────────────────────────────────────────────
// checkout.page.ts — use backend total + correct price path
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
import { CheckoutService } from './checkout.service';

@Component({
  standalone: true,
  selector: 'app-checkout-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    UiTextInputComponent,
    UiButtonComponent,
  ],
  template: `
    <section
      class="min-h-screen bg-gradient-to-r from-slate-50 to-slate-100 py-36 lg:py-[14rem] "
    >
      <div
        class="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2"
      >
        <!-- Summary Pane -->
        <div class="hidden lg:block relative bg-[var(--accent-complimentary)]">
          <div
            class="absolute inset-0 p-10 flex flex-col justify-between text-white"
          >
            <div>
              <h2 class="text-4xl font-extrabold mb-2">Order Summary</h2>
              <p class="opacity-80 mb-6">
                Review your selected books before checkout.
              </p>

              <div
                *ngFor="let item of cartItems"
                class="flex items-start justify-between mb-4"
              >
                <div class="flex items-center space-x-4">
                  <img
                    [src]="item.book.photoUrl"
                    class="h-14 w-10 rounded-lg shadow-md object-cover"
                  />
                  <div>
                    <p class="font-medium leading-tight">
                      {{ item.book.title }}
                    </p>
                    <p class="text-sm opacity-80">
                      Qty: {{ item.selectedAmount }}
                    </p>
                  </div>
                </div>
                <p class="font-semibold whitespace-nowrap">
                  {{ item.book.price * item.selectedAmount | currency: 'EUR' }}
                </p>
              </div>
            </div>

            <div
              class="border-t border-white/30 pt-4 text-xl font-bold flex justify-between"
            >
              <span>Total</span>
              <span>{{ total | currency: 'EUR' }}</span>
            </div>
          </div>
        </div>

        <!-- Form Pane -->
        <div class="p-8 md:p-12 lg:p-16 bg-white">
          <h1 class="text-4xl font-bold text-gray-800 mb-2">Checkout</h1>
          <p class="text-gray-500 mb-8">
            Enter your shipping details to complete your purchase.
          </p>

          <form [formGroup]="checkoutForm" class="space-y-8">
            <ui-text-input
              label="Full Name"
              placeholder="John Doe"
              [invalid]="isInvalid('fullName')"
              invalidText="Required"
              formControlName="fullName"
              inputId="fullName"
            ></ui-text-input>
            <ui-text-input
              label="Address"
              placeholder="123 Main St"
              [invalid]="isInvalid('address')"
              invalidText="Required"
              formControlName="address"
              inputId="address"
            ></ui-text-input>

            <div class="grid gap-6 md:grid-cols-2">
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

            <ui-text-input
              label="Email"
              placeholder="john.doe@example.com"
              [invalid]="isInvalid('email')"
              invalidText="Invalid email"
              formControlName="email"
              inputId="email"
            ></ui-text-input>

            <!-- Mobile summary -->
            <div
              class="lg:hidden border-t pt-6 space-y-4"
              *ngIf="cartItems.length"
            >
              <h2 class="text-2xl font-bold">Order Summary</h2>
              <div *ngFor="let item of cartItems" class="flex justify-between">
                <span>{{ item.book.title }} ×{{ item.selectedAmount }}</span>
                <span>{{
                  item.book.price * item.selectedAmount | currency: 'EUR'
                }}</span>
              </div>
              <div class="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{{ total | currency: 'EUR' }}</span>
              </div>
            </div>

            <div class="flex justify-end pt-4">
              <ui-button
                size="lg"
                [disabled]="checkoutForm.invalid"
                (buttonClick)="submit()"
                >Place Order</ui-button
              >
            </div>
          </form>

          <div
            *ngIf="confirmation()"
            class="mt-10 p-6 rounded-2xl bg-green-50 border border-green-200"
          >
            <h3 class="text-2xl font-semibold text-green-700 mb-2">
              Order Confirmed!
            </h3>
            <p>
              Your order <strong>{{ confirmation()?.orderId }}</strong> has been
              placed. Estimated delivery:
              <strong>{{ confirmation()?.estimatedDelivery }}</strong
              >.
            </p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [],
})
export class CheckoutPageComponent implements OnInit {
  cartItems: CartItem[] = [];
  cart!: Cart;
  checkoutForm: FormGroup;
  confirmation = signal<any>(null);

  /** Prefer backend total, fallback to client calc */
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
