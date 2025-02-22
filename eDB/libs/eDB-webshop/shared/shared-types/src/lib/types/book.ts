export interface Book {
  id?: number | undefined;
  photoUrl?: string;
  userId?: number;
  genre?: string;
  description?: string;
  title?: string;
  author?: string;
  status?: string;
  publishedDate?: string;
  lastLoanedDate?: Date;
}

export interface FavouriteBook extends Book {
  originalId?: number;
}

export interface RawApiFavouriteBook {
  data: {
    id?: number | undefined;
    photoUrl?: string;
    userId?: number;
    genre?: string;
    description?: string;
    title?: string;
    author?: string;
    status?: string;
    publishedDate?: string;
    lastLoanedDate?: Date;
    originalId?: number;
  };
}
