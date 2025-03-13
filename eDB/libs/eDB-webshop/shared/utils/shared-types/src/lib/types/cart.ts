import { Book } from './book';

export interface OrderItem {
  id: number;
  bookId: number;
  selectedAmount: number;
  price: number; // You might convert the string to a number if necessary.
  book: Book;
}

export interface Order {
  id: number;
  userId: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderApiResponse {
  data: Order;
}

export interface CartItemCreateRequest {
  id: number; // The book's id
  selectedAmount: number; // The amount/quantity the user wants to add
}
