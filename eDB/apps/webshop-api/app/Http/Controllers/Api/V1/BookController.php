<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Book;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\Book\StoreBookRequest;
use App\Http\Requests\Book\UpdateBookRequest;
use App\Http\Resources\V1\Book\BookResource;
use App\Services\BookService;

class BookController extends Controller
{
    public function __construct(
        protected BookService $bookService
    ) {
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Collect input for pagination/filtering
        $pageSize = (int) $request->input('page_size', 15);
        $offset   = (int) $request->input('offset', 0);
        $limit    = (int) $request->input('limit', $pageSize);

        // Build a filter array
        $filters = [];
        if ($request->has('status')) {
            $filters['status'] = $request->input('status');
        }

        // Delegate to the service
        $result = $this->bookService->getBooks($filters, $offset, $limit);
        $books  = $result['books'];
        $total  = $result['total'];

        return response()->json([
            'data' => [
                'items'   => BookResource::collection($books),
                'count'   => $total,
                'hasMore' => (($offset + $limit) < $total),
                'offset'  => $offset,
                'limit'   => $limit,
            ]
        ]);
    }

    public function store(StoreBookRequest $request): BookResource
    {
        $book = $this->bookService->createBook($request->validated());
        return new BookResource($book);
    }

    public function show(Book $book): BookResource
    {
        return new BookResource($book);
    }

    public function update(UpdateBookRequest $request, Book $book)
    {
        $this->bookService->updateBook($book, $request->validated());
        return response()->json(['message' => 'Book updated successfully']);
    }

    public function destroy(Book $book)
    {
        $this->bookService->deleteBook($book);
        return response()->json(['message' => 'Book deleted successfully']);
    }
}
