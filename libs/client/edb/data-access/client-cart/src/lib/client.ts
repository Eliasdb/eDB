// ─────────────────────────────────────────────────────────────
// cart.service.ts — renamed Order* types to Cart*
// ─────────────────────────────────────────────────────────────
import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { environment } from '@eDB/shared-env';
import {
  CartApiResponse,
  CartItem,
  CartItemCreateRequest,
} from '@edb/shared-types';
import {
  injectMutation,
  injectQuery,
  MutationOptions,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { firstValueFrom, Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

/** Backend returns { data: Cart } */
type CartResponse = CartApiResponse;

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly queryClient = inject(QueryClient);

  // ───────── QUERY: whole cart ─────────
  private readonly cartQuery = injectQuery<CartResponse>(() => ({
    queryKey: ['cart'],
    queryFn: () =>
      firstValueFrom(
        this.http.get<CartResponse>(`${environment.bookAPIUrl}/cart`),
      ),
    refetchOnWindowFocus: false,
  }));

  // derived signals
  readonly cart = computed(() => this.cartQuery.data?.()?.data);
  readonly cartItems = computed(() => this.cart()?.items ?? []);
  readonly isLoading = computed(() => this.cartQuery.isLoading?.() ?? false);
  readonly error = computed(() => this.cartQuery.error?.()?.message ?? null);

  // ───────── helpers ─────────
  getItemByBookId(id: number): CartItem | undefined {
    return this.cartItems().find((it) => it.bookId === id);
  }

  // ───────── mutation: add line (POST) ─────────
  private readonly addToCartMutation = injectMutation<
    CartResponse,
    Error,
    CartItemCreateRequest
  >(
    (): MutationOptions<CartResponse, Error, CartItemCreateRequest> => ({
      mutationFn: (payload) => {
        const body = {
          id: payload.id,
          selectedAmount: payload.selectedAmount,
        } as const;
        return firstValueFrom(
          this.http.post<CartResponse>(
            `${environment.bookAPIUrl}/cart/items`,
            body,
          ),
        );
      },
      onSuccess: () =>
        this.queryClient.invalidateQueries({ queryKey: ['cart'] }),
    }),
  );
  addToCart(payload: CartItemCreateRequest) {
    this.addToCartMutation.mutate(payload);
  }

  // ───────── mutation: remove line (DELETE) ─────────
  private readonly removeFromCartMutation = injectMutation<
    CartResponse,
    Error,
    number
  >(
    (): MutationOptions<CartResponse, Error, number> => ({
      mutationFn: (cartItemId) =>
        firstValueFrom(
          this.http.delete<CartResponse>(
            `${environment.bookAPIUrl}/cart/items/${cartItemId}`,
          ),
        ),
      onSuccess: () =>
        this.queryClient.invalidateQueries({ queryKey: ['cart'] }),
    }),
  );
  removeFromCart(cartItemId: number) {
    this.removeFromCartMutation.mutate(cartItemId);
  }

  // ───────── mutation: update quantity (PATCH) ─────────
  private readonly _saveSubs = new Map<number, Subscription>();
  updateItemQuantity(bookId: number, quantity: number) {
    const line = this.getItemByBookId(bookId);
    if (!line) return;

    const cartItemId = line.id;
    const oldCart = this.queryClient.getQueryData<CartResponse>(['cart']);
    if (!oldCart) return;

    const newCart: CartResponse = {
      ...oldCart,
      data: {
        ...oldCart.data,
        items: oldCart.data.items.map((it) =>
          it.id === cartItemId ? { ...it, selectedAmount: quantity } : it,
        ),
      },
    };
    this.queryClient.setQueryData(['cart'], newCart);

    this._saveSubs.get(cartItemId)?.unsubscribe();
    const sub = timer(400)
      .pipe(
        switchMap(() =>
          this.http.patch<CartResponse>(
            `${environment.bookAPIUrl}/cart/items/${cartItemId}`,
            { selectedAmount: quantity },
          ),
        ),
      )
      .subscribe({
        next: () => this.queryClient.invalidateQueries({ queryKey: ['cart'] }),
        error: () => {
          this.queryClient.setQueryData(['cart'], oldCart);
        },
      });
    this._saveSubs.set(cartItemId, sub);
  }
}
