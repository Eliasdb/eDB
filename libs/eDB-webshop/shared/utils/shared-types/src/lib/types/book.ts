export interface Book {
  id: number;
  photoUrl: string;
  blurDataUrl: string; // ✅ Add this
  genre: string;
  description: string;
  title: string;
  price: number;
  stock: number;
  author: string;
  status: string;
  publishedDate: string;
}
