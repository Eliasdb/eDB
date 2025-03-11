import { Book } from './book';

export interface RawApiDataBooks {
  data: {
    items: Book[];
    count: number;
    hasMore: boolean;
    offset: string;
    limit: string;
  };
}
export interface RawApiDataBook {
  data: Book;
}
