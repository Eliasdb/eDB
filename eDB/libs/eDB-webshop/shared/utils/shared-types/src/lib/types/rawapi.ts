import { Book } from './book';

export interface RawApiDataBooks {
  data: {
    items: Book[];
    count: number;
  };
}
export interface RawApiDataBook {
  data: Book;
}
