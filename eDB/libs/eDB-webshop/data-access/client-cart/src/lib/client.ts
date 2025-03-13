import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import {
  Book,
  CartItemCreateRequest,
  OrderApiResponse,
} from '@eDB-webshop/shared-types';
import { environment } from '@eDB/shared-env';
import {
  injectMutation,
  injectQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private http = inject(HttpClient);
  private queryClient = inject(QueryClient);

  public selectedAmount = signal<number>(1);

  private cartResult = injectQuery(() => ({
    queryKey: ['cart'],
    queryFn: async () =>
      await firstValueFrom(
        this.http.get<OrderApiResponse>(`${environment.bookAPIUrl}/cart`),
      ),
    refetchOnWindowFocus: false,
  }));

  cart = computed(() => this.cartResult.data?.() || []);
  cartItems = computed(() => {
    const response = this.cartResult.data?.();

    return response?.data?.items || [];
  });

  isLoading = computed(() => this.cartResult.isLoading?.());
  error = computed(() => this.cartResult.error?.()?.message || null);

  // Update mutation to accept the minimal payload
  readonly addToCartMutation = injectMutation(() => ({
    mutationFn: async (payload: CartItemCreateRequest) => {
      const updatedCart = await firstValueFrom(
        this.http.post<OrderApiResponse>(
          `${environment.bookAPIUrl}/cart/items`,
          payload,
        ),
      );
      if (!updatedCart) {
        throw new Error('Failed to update cart');
      }
      console.log(updatedCart);
      return updatedCart;
    },
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  }));

  addToCart(payload: CartItemCreateRequest) {
    // Execute the mutation with the provided payload (just id and selectedAmount)
    this.addToCartMutation.mutate(payload);
  }

  readonly removeFromCartMutation = injectMutation(() => ({
    mutationFn: async (cartItemId: number) => {
      return firstValueFrom(
        this.http.delete<Book>(
          `${environment.bookAPIUrl}/cart/items/${cartItemId}`,
        ),
      );
    },
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  }));

  removeFromCart(cartItemId: number) {
    this.removeFromCartMutation.mutate(cartItemId);
  }
}
