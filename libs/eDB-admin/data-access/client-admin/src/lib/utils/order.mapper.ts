import { formatDate } from '@angular/common';
import type { Order, OrderDto } from '@eDB-webshop/shared-types';

export function mapOrderDtoToOrder(dto: OrderDto): Order {
  return {
    id: dto.id,
    date: formatDate(dto.orderDate, 'longDate', 'en-US') ?? '',
    status: dto.status,
    total: Number(dto.amount),
    fullName: dto.fullName,
    email: dto.email,
    address: dto.address,
    city: dto.city,
    postalCode: dto.postalCode,
    items: dto.items.map((item) => ({
      name: item.book.title,
      quantity: item.quantity,
      price: Number(item.price),
    })),
  };
}
