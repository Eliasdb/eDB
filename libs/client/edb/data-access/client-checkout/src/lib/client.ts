// ─────────────────────────────────────────────────────────────
// checkout.service.ts   (only order-creation logic now)
// ─────────────────────────────────────────────────────────────
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { environment } from '@eDB/shared-env';
import {
  injectMutation,
  injectQuery,
  MutationOptions,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';

// Adjust these when you add backend typings
export interface OrderCreateRequest {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  email: string;
}

export interface OrderResponse {
  orderId: string;
  status: string;
  estimatedDelivery: string;
}
export interface StripeCheckoutResponse {
  url: string;
}

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  private readonly http = inject(HttpClient);
  private readonly queryClient = inject(QueryClient);

  // ───────── mutation: create order (POST) ─────────
  private readonly createOrderMutation = injectMutation<
    OrderResponse,
    Error,
    OrderCreateRequest
  >(
    (): MutationOptions<OrderResponse, Error, OrderCreateRequest> => ({
      mutationFn: (payload) =>
        firstValueFrom(
          this.http.post<OrderResponse>(
            `${environment.bookAPIUrl}/orders`,
            payload,
          ),
        ),
      onSuccess: () => {
        // Refetch the cart so it's cleared visually after the order is placed
        this.queryClient.invalidateQueries({ queryKey: ['cart'] });
        this.queryClient.invalidateQueries({ queryKey: ['orders'] });
      },
    }),
  );

  /**
   * Public helper that wraps the mutation in a promise so
   * the component can simply `await submitOrder(...)`.
   */
  submitOrder(payload: OrderCreateRequest): Promise<OrderResponse> {
    return new Promise<OrderResponse>((resolve, reject) => {
      this.createOrderMutation.mutate(payload, {
        onSuccess: resolve,
        onError: reject,
      });
    });
  }

  submitCheckoutSession(
    payload: OrderCreateRequest,
  ): Promise<StripeCheckoutResponse> {
    return firstValueFrom(
      this.http.post<StripeCheckoutResponse>(
        `${environment.bookAPIUrl}/checkout-session`,
        payload,
      ),
    );
  }

  /** ───── Raw HTTP helper now returns a Promise ───── */
  getOrderConfirmation(sessionId: string): Promise<OrderResponse> {
    return firstValueFrom(
      this.http.get<OrderResponse>(
        `${environment.bookAPIUrl}/checkout-success?session_id=${sessionId}`,
      ),
    );
  }

  /** ───── TanStack Query wrapper (signal‑friendly) ───── */
  useOrderConfirmation(sessionId: Signal<string | null>) {
    return injectQuery<OrderResponse>(() => {
      // 👇 read the signal each time the function re‑runs
      const id = sessionId();

      return {
        queryKey: ['order', id], // key includes the real string
        enabled: !!id, // only run when we have an id
        queryFn: () => {
          if (!id) throw new Error('No session id yet');
          return this.getOrderConfirmation(id);
        },
        staleTime: 5 * 60 * 1000,
        refetchOnMount: false,

        onSuccess: () => {
          console.log('order confirmed – invalidating caches');
          this.queryClient.refetchQueries({ queryKey: ['orders'] });
          this.queryClient.refetchQueries({ queryKey: ['cart'] });
        },
      };
    });
  }
}
