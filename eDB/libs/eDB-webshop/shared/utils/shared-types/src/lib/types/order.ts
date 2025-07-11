import { Book } from './book';

export interface OrderItem {
  id: number;
  bookId: number;
  selectedAmount: number;
  price: number;
  book: Book;
}
