import { FastifyInstance } from 'fastify';
import { BookService } from './book.service';

// if you already have zod schemas for request bodies, import them here:
import {
  createBookBodySchema,
  updateBookBodySchema,
} from '@edb-workbench/api/models';

// helper to coerce query params into PaginationPlan
function buildPlanFromQuery(q: any) {
  // q = req.query (Fastify gives you strings)
  const page = q.page ? Number(q.page) : 1;
  const pageSize = q.pageSize ? Number(q.pageSize) : 10;

  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  // optional sorters: ?sortField=title&sortDir=desc
  const sorters =
    q.sortField && q.sortDir
      ? [
          {
            field: String(q.sortField),
            dir: String(q.sortDir) as 'asc' | 'desc',
          },
        ]
      : [];

  // filters: anything like ?status=published&publishedYear=2010
  // we'll just forward all query keys except known paging/sorting/search keys
  const reserved = new Set([
    'page',
    'pageSize',
    'sortField',
    'sortDir',
    'search',
    'authorId',
  ]);
  const filters: Record<string, string> = {};
  for (const [k, v] of Object.entries(q)) {
    if (!reserved.has(k) && typeof v === 'string') {
      filters[k] = v;
    }
  }

  return {
    page,
    pageSize,
    offset,
    limit,
    sorters,
    filters,
  };
}

export async function registerBookRoutes(app: FastifyInstance) {
  //
  // POST /books
  //
  app.post('/books', async (req, reply) => {
    const body = createBookBodySchema.parse(req.body);
    const created = await BookService.create(body);
    return reply.code(201).send(created);
  });

  //
  // GET /books
  // supports: ?page=1&pageSize=10&search=way&status=published&sortField=title&sortDir=desc
  //
  app.get('/books', async (req, reply) => {
    const q = req.query as Record<string, any>;
    const plan = buildPlanFromQuery(q);

    const search =
      typeof q['search'] === 'string' && q['search'].trim() !== ''
        ? q['search']
        : undefined;

    // we ALSO forward top-level filters object to repo.list via BookService.list().
    // service.list() already merges plan.filters with this "filter" param.
    // if you don't want double merge, pass empty here. for now we'll pass undefined.
    const out = await BookService.list({
      plan,
      search,
      filter: undefined,
    });

    return reply.send(out);
  });

  //
  // GET /books/:id
  //
  app.get('/books/:id', async (req, reply) => {
    const { id } = req.params as { id: string };

    const book = await BookService.getById(id);
    if (!book) {
      return reply.code(404).send({ message: 'Book not found' });
    }

    return reply.send(book);
  });

  //
  // PATCH /books/:id
  //
  app.patch('/books/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    const body = updateBookBodySchema.parse(req.body);

    const updated = await BookService.update(id, body);
    if (!updated) {
      return reply.code(404).send({ message: 'Book not found' });
    }

    return reply.send(updated);
  });

  //
  // DELETE /books/:id
  //
  app.delete('/books/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    const ok = await BookService.delete(id);
    return reply.send({ ok });
  });

  //
  // GET /authors/:authorId/books
  // nice REST shape for listByAuthor()
  //
  app.get('/authors/:authorId/books', async (req, reply) => {
    const { authorId } = req.params as { authorId: string };
    const q = req.query as Record<string, any>;
    const plan = buildPlanFromQuery(q);

    const search =
      typeof q['search'] === 'string' && q['search'].trim() !== ''
        ? q['search']
        : undefined;

    const out = await BookService.listByAuthor({
      authorId,
      plan,
      search,
      filter: undefined,
    });

    return reply.send(out);
  });

  //
  // GET /books/:id/tags
  // surfaces repo.listTagsForBook()
  //
  app.get('/books/:id/tags', async (req, reply) => {
    const { id } = req.params as { id: string };
    const rows = await BookService.listTagsForBook(id);
    return reply.send(rows);
  });
}
