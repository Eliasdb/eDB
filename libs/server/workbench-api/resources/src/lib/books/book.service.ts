import { BookRepoPg } from '@edb-workbench/api/infra';
import type {
  Book,
  CreateBookBody,
  UpdateBookBody,
} from '@edb-workbench/api/models';
import type { PaginationPlan } from '@edb-workbench/api/shared';

export class BookService {
  //
  // READS
  //
  static async list(args: {
    plan: PaginationPlan;
    search?: string;
    filter?: Record<string, string>;
  }) {
    // passthrough to repo.list
    return BookRepoPg.list(args);
  }

  static async listByAuthor(args: {
    authorId: string;
    plan: PaginationPlan;
    search?: string;
    filter?: Record<string, string>;
  }) {
    return BookRepoPg.listByAuthor(args);
  }

  static async getById(id: string): Promise<Book | undefined> {
    return BookRepoPg.getById(id);
  }

  static async listTagsForBook(bookId: string) {
    return BookRepoPg.listTagsForBook(bookId);
  }

  //
  // WRITES
  //
  static async create(body: CreateBookBody): Promise<Book> {
    // We trust upstream zod to validate shape.
    return BookRepoPg.create(body);
  }

  static async update(
    id: string,
    body: UpdateBookBody,
  ): Promise<Book | undefined> {
    return BookRepoPg.update(id, body);
  }

  static async delete(id: string): Promise<boolean> {
    return BookRepoPg.delete(id);
  }
}
