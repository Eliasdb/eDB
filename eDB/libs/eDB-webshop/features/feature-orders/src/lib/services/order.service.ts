import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@eDB/shared-env';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';

import type {
  Order,
  OrderStatus,
  OrdersApiResponse,
} from '../types/order.types';

type OrdersKey = ['orders']; // helps TypeScript keep the key literal

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);

  /** The ready-to-use list for the UI */
  readonly ordersQuery = injectQuery<
    OrdersApiResponse, // ── TQueryFnData (raw)
    Error, // ── TError
    Order[], // ── TData (after select)
    OrdersKey // ── TQueryKey
  >(() => ({
    queryKey: ['orders'] as OrdersKey,

    queryFn: () =>
      firstValueFrom(
        this.http.get<OrdersApiResponse>(`${environment.bookAPIUrl}/orders`),
      ),

    /* transform → UI model */
    select: (resp): Order[] =>
      resp.data.map(
        (dto): Order => ({
          id: dto.id,
          date: formatDate(dto.orderDate, 'longDate', 'en-US'),
          status: dto.status as OrderStatus,
          total: Number(dto.amount),
          items: dto.items.map((i) => ({
            name: i.book.title,
            quantity: i.quantity,
            price: Number(i.price),
          })),
        }),
      ),

    refetchOnWindowFocus: false,
  }));
}
