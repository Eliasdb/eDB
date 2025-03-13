<?php

namespace App\Services;

use App\Models\Book;
use Illuminate\Database\Eloquent\Collection;

class BookService
{
    public function getBooks(array $filters = [], int $offset = 0, int $limit = 15): array
    {
        // Start with Book::query() or a filter approach
        $query = Book::filter();

        // Example: If "status" is provided, filter by it
        if (isset($filters['status']) && $filters['status'] === 'loaned') {
            $query->where('status', 'loaned');
        }

        // ✅ Correct: Get the total count BEFORE applying pagination
        $total = $query->count();

        // Apply pagination AFTER getting total count
        $books = $query->skip($offset)->take($limit)->get();

        return [
            'books' => $books,
            'total' => $total
        ];
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
}
