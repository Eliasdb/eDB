// ─────────────────────────────────────────────────────────────
// checkout.service.ts   (only order-creation logic now)
// ─────────────────────────────────────────────────────────────
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@eDB/shared-env';
import {
  injectMutation,
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
}
