<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Book;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\Book\StoreBookRequest;
use App\Http\Requests\Book\UpdateBookRequest;
use App\Http\Resources\V1\Book\BookResource;
use App\Http\Resources\V1\Book\BookCollection;

class BookController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Set default pagination values
        $pageSize = $request->input('page_size', 15);
        $offset   = $request->input('offset', 0);
        $limit    = $request->input('limit', $pageSize);

        // Use the FilterQueryString trait to automatically apply filters.
        $query = Book::filter();

        // If filtering by "loaned" status, add the condition.
        if ($request->status === 'loaned') {
            $query->where('status', 'loaned');
        }

        $total = $query->count();
        $books = $query->skip($offset)
                       ->take($limit)
                       ->get();

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

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBookRequest $request): BookResource
    {
        return new BookResource(Book::create($request->all()));
    }

    /**
     * Display the specified resource.
     */
    public function show(Book $book): BookResource
    {
        return new BookResource($book);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Book $book)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBookRequest $request, Book $book)
    {
        $book->update($request->all());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Book $book)
    {
        $book->delete($request->all());
    }
}
