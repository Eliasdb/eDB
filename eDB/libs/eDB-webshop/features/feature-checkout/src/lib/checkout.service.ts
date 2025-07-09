// ─────────────────────────────────────────────────────────────
// checkout.service.ts
// ─────────────────────────────────────────────────────────────
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CartApiResponse } from '@eDB-webshop/shared-types';
import { environment } from '@eDB/shared-env';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  private readonly http = inject(HttpClient);

  /**
   * Fetches the current cart (to display order summary on checkout).
   */
  getCart() {
    return firstValueFrom(
      this.http.get<CartApiResponse>(`${environment.bookAPIUrl}/cart`),
    ).then((resp) => resp.data);
  }

  /**
   * Mock submitting an order. For now, resolves immediately with mock confirmation.
   */
  submitOrder(orderData: any) {
    // Replace with real POST when backend exists
    return Promise.resolve({
      orderId: 'MOCK-12345',
      status: 'CONFIRMED',
      estimatedDelivery: '2025-07-20',
    });
  }
}
