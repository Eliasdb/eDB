// Angular
import { Component, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

// Services
import { CheckoutService } from '@edb/client-checkout';
import { QueryClient } from '@tanstack/angular-query-experimental';

// Rxjs
import { map } from 'rxjs';

@Component({
  selector: 'app-checkout-success-page',
  template: `
    <section class="min-h-screen flex items-center justify-center">
      @if (orderQuery.isPending()) {
        <div>Verifying payment...</div>
      } @else if (orderQuery.data()) {
        <div>
          <h2>Thank you!</h2>
          <p>
            Your order <strong>{{ orderQuery.data()!.orderId }}</strong> is
            confirmed.
          </p>
        </div>
      } @else if (orderQuery.isError()) {
        <div>Something went wrong.</div>
      }
    </section>
  `,
})
export class CheckoutSuccessPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly checkout = inject(CheckoutService);
  private readonly queryClient = inject(QueryClient);

  /** 👇 Invalidate only when data() becomes truthy */
  constructor() {
    effect(() => {
      if (this.orderQuery.data()) {
        this.queryClient.invalidateQueries({ queryKey: ['orders'] });
        this.queryClient.invalidateQueries({ queryKey: ['cart'] });
        console.log('✅ side effect triggered in component');
      }
    });
  }

  /** session_id from URL as a signal (`undefined` removed) */
  private readonly sessionId = toSignal<string | null>(
    this.route.queryParamMap.pipe(map((p) => p.get('session_id'))),
    { initialValue: null },
  );

  /** query logic delegated to the service */
  readonly orderQuery = this.checkout.useOrderConfirmation(this.sessionId);
}
