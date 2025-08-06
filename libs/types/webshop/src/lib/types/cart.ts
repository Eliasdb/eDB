// ─────────────────────────────────────────────────────────────
// shared-types.ts — rename Order* to Cart*
// ─────────────────────────────────────────────────────────────
import { Book } from './book';

export interface CartItem {
  id: number;
  bookId: number;
  selectedAmount: number;
  price: number;
  book: Book;
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
  total: number;
}

export interface CartApiResponse {
  data: Cart;
}

export interface CartItemCreateRequest {
  id: number; // The book's id
  selectedAmount: number; // The amount/quantity the user wants to add
}
