import { Injectable, computed, signal } from '@angular/core';
import { Book } from '@edb/shared-types';

const STORAGE_KEY = 'webshop:wishlist';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly wishlist = signal<Book[]>(this.readWishlist());

  readonly items = this.wishlist.asReadonly();
  readonly count = computed(() => this.items().length);

  isWishlisted(bookId: number | undefined): boolean {
    return (
      bookId !== undefined && this.items().some((book) => book.id === bookId)
    );
  }

  toggle(book: Book | undefined): void {
    if (!book) return;

    const exists = this.isWishlisted(book.id);
    const next = exists
      ? this.items().filter((item) => item.id !== book.id)
      : [book, ...this.items()];

    this.setWishlist(next);
  }

  remove(bookId: number): void {
    this.setWishlist(this.items().filter((book) => book.id !== bookId));
  }

  private setWishlist(items: Book[]): void {
    this.wishlist.set(items);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }

  private readWishlist(): Book[] {
    if (typeof localStorage === 'undefined') return [];

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Book[]) : [];
    } catch {
      return [];
    }
  }
}
