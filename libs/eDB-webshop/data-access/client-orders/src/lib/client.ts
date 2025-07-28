// order.service.ts
import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { environment } from '@eDB/shared-env';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';

import type {
  Order,
  OrdersApiResponse,
  OrderStatus,
} from '@eDB-webshop/shared-types';

type OrdersKey = ['orders'];

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);

  readonly ordersQuery = injectQuery<
    OrdersApiResponse,
    Error,
    Order[],
    OrdersKey
  >(() => ({
    queryKey: ['orders'],
    queryFn: () =>
      firstValueFrom(
        this.http.get<OrdersApiResponse>(`${environment.bookAPIUrl}/orders`),
      ),
    select: (resp): Order[] =>
      resp.data.map((dto) => ({
        id: dto.id,
        date: formatDate(dto.orderDate, 'longDate', 'en-US'),
        status: dto.status as OrderStatus,
        total: Number(dto.amount),
        items: dto.items.map((i) => ({
          name: i.book.title,
          quantity: i.quantity,
          price: Number(i.price),
        })),
      })),
    refetchOnWindowFocus: false,
  }));

  readonly orders = computed(() => this.ordersQuery.data?.() ?? []);
  readonly orderCount = computed(() => this.orders().length);
}
