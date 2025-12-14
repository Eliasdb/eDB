export { authorIdParamSchema, authorSchema, createAuthorBodySchema, updateAuthorBodySchema, } from './author.model';
export type { Author, AuthorIdParam, AuthorRepo, CreateAuthorBody, UpdateAuthorBody, } from './author.model';
export { bookIdParamSchema, bookSchema, createBookBodySchema, updateBookBodySchema, } from './book.model';
export type { Book, BookIdParam, BookRepo, CreateBookBody, UpdateBookBody, } from './book.model';
export { createTagBodySchema, tagIdParamSchema, tagSchema, updateTagBodySchema, } from './tag.model';
export type { CreateTagBody, Tag, TagIdParam, TagRepo, UpdateTagBody, } from './tag.model';
export { bookTagSchema } from './bookTag.model';
export type { BookTag, BookTagRepo } from './bookTag.model';
