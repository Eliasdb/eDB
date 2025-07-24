// shared-types/ai-search.ts
export interface AiBookItem {
  id: number;
  photoUrl: string;
  title: string;
  author: string;
  description: string;
  genre: string;
  status: string;
  price: number;
  stock: number;
  publishedDate: string;
  blurDataUrl?: string;
}

export interface AiFiltersUsed {
  [key: string]: string; // e.g. { genre: "drama", price: "<20" }
}

export interface AiSearchResponse {
  query: string;
  filters_used: Record<string, string>;
  items: AiBookItem[];
  total: number;
  hasMore: boolean;
  offset?: number;
  limit?: number;
}
