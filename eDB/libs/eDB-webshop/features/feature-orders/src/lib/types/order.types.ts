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
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
}
