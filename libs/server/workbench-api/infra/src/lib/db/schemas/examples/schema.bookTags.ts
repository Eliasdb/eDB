import { pgTable, primaryKey, timestamp, uuid } from 'drizzle-orm/pg-core';
import { booksTable } from './schema.books';
import { tagsTable } from './schema.tags';

export const bookTagsTable = pgTable(
  'book_tags',
  {
    bookId: uuid('book_id')
      .notNull()
      .references(() => booksTable.id, { onDelete: 'cascade' }),

    tagId: uuid('tag_id')
      .notNull()
      .references(() => tagsTable.id, { onDelete: 'cascade' }),

    created_at: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.bookId, t.tagId] }),
  }),
);
