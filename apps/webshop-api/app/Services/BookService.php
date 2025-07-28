<?php

namespace App\Services;

use App\Models\Book;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Builder;
use Laravel\Scout\Builder as ScoutBuilder;
use Meilisearch\Endpoints\Indexes;

class BookService
{
    public function getBooks(array $filters = [], int $offset = 0, int $limit = 15): array
    {
        $query = Book::filter();

        // Optional: custom logic on top
        if (isset($filters['status']) && $filters['status'] === 'loaned') {
            $query->where('status', 'loaned');
        }

        $total = $query->count();

        $books = $query->skip($offset)->take($limit)->get();

        return [
            'books' => $books,
            'total' => $total
        ];
    }

    // public function getBooksFromAI(array $filters = [], int $offset = 0, int $limit = 15): array
    // {
    //     $query = Book::query();

    //     $this->applyAIManualFilters($query, $filters);

    //     $total = $query->count();

    //     $books = $query->skip($offset)->take($limit)->get();

    //     return [
    //         'books' => $books,
    //         'total' => $total,
    //     ];
    // }


    public function getBooksFromAI(array $filters = [], int $offset = 0, int $limit = 15): array
    {
        // 1) Extract search term and remove it from filters array
        $searchTerm = $filters['searchFilter'] ?? '';
        unset($filters['searchFilter']);

        // 2) Build Meilisearch filter string
        $filterParts = [];
        foreach ($filters as $key => $value) {
            if (in_array($key, ['genre','author','status','title','published_date'])) {
                // equality
                $filterParts[] = sprintf('%s = "%s"', $key, addslashes($value));
            } elseif (in_array($key, ['price','stock'])) {
                $filterParts[] = $this->convertRangeToMeiliSyntax($key, $value);
            }
        }
        $filterParts = array_filter($filterParts); // drop empty strings
        $filterString = implode(' AND ', $filterParts);

        // 3) Do the Meilisearch query with a custom callback so we can pass filter/offset/limit
        $page    = (int) floor($offset / $limit) + 1; // for paginate()
        $builder = Book::search($searchTerm, function (Indexes $index, string $query, array $options) use ($filterString, $offset, $limit) {
            if ($filterString !== '') {
                $options['filter'] = $filterString;
            }
            $options['offset'] = $offset;
            $options['limit']  = $limit;

            return $index->search($query, $options);
        });

        // Scout's paginate() gives us total & items cleanly
        $results = $builder->paginate($limit, 'page', $page);

        return [
            'books' => collect($results->items()),
            'total' => $results->total(),
        ];
    }

    private function convertRangeToMeiliSyntax(string $field, string|int $value): string
    {
        if (preg_match('/^(\d+)\s*-\s*(\d+)$/', (string)$value, $m)) {
            return sprintf('(%s >= %d AND %s <= %d)', $field, $m[1], $field, $m[2]);
        }
        if (preg_match('/^>\s*(\d+)$/', (string)$value, $m)) {
            return sprintf('%s > %d', $field, $m[1]);
        }
        if (preg_match('/^<\s*(\d+)$/', (string)$value, $m)) {
            return sprintf('%s < %d', $field, $m[1]);
        }
        if (preg_match('/^>=\s*(\d+)$/', (string)$value, $m)) {
            return sprintf('%s >= %d', $field, $m[1]);
        }
        if (preg_match('/^<=\s*(\d+)$/', (string)$value, $m)) {
            return sprintf('%s <= %d', $field, $m[1]);
        }
        if (is_numeric($value)) {
            return sprintf('%s = %d', $field, $value);
        }

        return ''; // unknown pattern
    }





    private function applyAIManualFilters(Builder $query, array $filters): void
    {
        if (isset($filters['author'])) {
            $query->where('author', 'ILIKE', '%' . $filters['author'] . '%');
        }

        if (isset($filters['genre'])) {
            $query->where('genre', 'ILIKE', '%' . $filters['genre'] . '%');
        }

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['title'])) {
            $query->where('title', 'ILIKE', '%' . $filters['title'] . '%');
        }

        if (isset($filters['published_date'])) {
            $query->where('published_date', 'ILIKE', '%' . $filters['published_date'] . '%');
        }

        if (isset($filters['searchFilter'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'ILIKE', '%' . $filters['searchFilter'] . '%')
                  ->orWhere('description', 'ILIKE', '%' . $filters['searchFilter'] . '%');
            });
        }

        // ✅ NEW: Exact or range filters
        if (isset($filters['price'])) {
            $this->applyRangeFilter($query, 'price', $filters['price']);
        }

        if (isset($filters['stock'])) {
            $this->applyRangeFilter($query, 'stock', $filters['stock']);
        }
    }

    private function applyRangeFilter(Builder $query, string $field, string|int $value): void
    {
        if (preg_match('/^(\d+)\s*-\s*(\d+)$/', $value, $matches)) {
            // Format: "10 - 20"
            $query->whereBetween($field, [(int) $matches[1], (int) $matches[2]]);
        } elseif (preg_match('/^>\s*(\d+)$/', $value, $matches)) {
            $query->where($field, '>', (int) $matches[1]);
        } elseif (preg_match('/^<\s*(\d+)$/', $value, $matches)) {
            $query->where($field, '<', (int) $matches[1]);
        } elseif (is_numeric($value)) {
            $query->where($field, (int) $value);
        }
    }



    public function createBook(array $data): Book
    {
        return Book::create($data);
    }

    public function updateBook(Book $book, array $data): void
    {
        $book->update($data);
    }

    public function deleteBook(Book $book): void
    {
        $book->delete();
    }

    private function buildMeiliFilter(array $filters): string
    {
        $expressions = [];

        foreach ($filters as $key => $value) {
            if (in_array($key, ['genre', 'author', 'status', 'title', 'published_date'])) {
                $expressions[] = "$key = \"$value\"";
            }

            if (in_array($key, ['price', 'stock'])) {
                if (preg_match('/^(\d+)\s*-\s*(\d+)$/', $value, $m)) {
                    $expressions[] = "$key >= {$m[1]} AND $key <= {$m[2]}";
                } elseif (preg_match('/^>\s*(\d+)$/', $value, $m)) {
                    $expressions[] = "$key > {$m[1]}";
                } elseif (preg_match('/^<\s*(\d+)$/', $value, $m)) {
                    $expressions[] = "$key < {$m[1]}";
                } elseif (preg_match('/^>=\s*(\d+)$/', $value, $m)) {
                    $expressions[] = "$key >= {$m[1]}";
                } elseif (preg_match('/^<=\s*(\d+)$/', $value, $m)) {
                    $expressions[] = "$key <= {$m[1]}";
                } elseif (is_numeric($value)) {
                    $expressions[] = "$key = {$value}";
                }
            }
        }

        return implode(' AND ', $expressions);
    }

}
