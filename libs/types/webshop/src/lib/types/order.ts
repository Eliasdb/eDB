/** All statuses the backend may send. */
export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

/** Exact shape of the `/orders` JSON. */
export interface OrdersApiResponse {
  data: OrderDto[];
  links: Record<string, unknown>;
  meta: Record<string, unknown>;
}

export interface OrderDto {
  id: string;
  userId: string;
  amount: string;
  status: OrderStatus;
  orderDate: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItemDto[];

  // ✅ Add these fields to match backend output
  fullName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
}

export interface OrderItemDto {
  id: number;
  bookId: number;
  quantity: number;
  price: string;
  book: BookDto;
}

export interface BookDto {
  id: number;
  photoUrl: string;
  description: string;
  blurDataUrl: string;
  title: string;
  genre: string;
  author: string;
  status: string;
  price: number;
  stock: number;
  publishedDate: string;
}

/** UI-friendly model used by the component. */
export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  fullName?: string;
  email?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
}

import { Book } from './book';

export interface OrderItem {
  id: number;
  bookId: number;
  selectedAmount: number;
  price: number;
  book: Book;
}
