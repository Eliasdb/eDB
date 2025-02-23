<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Book;
use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use App\Http\Requests\Book\StoreBookRequest;
use App\Http\Requests\Book\UpdateBookRequest;
use App\Http\Resources\V1\Book\BookResource;
use App\Http\Resources\V1\Book\BookCollection;

use Illuminate\Support\Facades\DB;

class BookController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $pageSize = $request->page_size ?? 15;
        $offset = $request->offset ?? 0;
        $limit = $request->limit ?? 15;
        // $books = Book::offset($offset)->limit($limit)->filter()->get();

        if ($request->status == 'loaned') {
            switch ($request->sort) {
                case "title,asc":
                    $sql = DB::select(
                        "SELECT * FROM books 
                        WHERE (status = 'loaned' AND genre LIKE '%$request->genre%')
                        AND (title LIKE '%$request->q%' OR author LIKE '%$request->author%')
                        ORDER BY title ASC
                        "
                    );
                    return new BookCollection($sql);
                    break;
                case "title,desc":
                    $sql = DB::select(
                        "SELECT * FROM books 
                        WHERE (status = 'loaned' AND genre LIKE '%$request->genre%')
                        AND (title LIKE '%$request->q%' OR author LIKE '%$request->author%')
                        ORDER BY title DESC
                        "
                    );
                    return new BookCollection($sql);
                    break;
                case "author,asc":
                    $sql = DB::select(
                        "SELECT * FROM books 
                        WHERE (status = 'loaned' AND genre LIKE '%$request->genre%')
                        AND (title LIKE '%$request->q%' OR author LIKE '%$request->author%')
                        ORDER BY author ASC
                        "
                    );
                    return new BookCollection($sql);
                    break;
                case "author,desc":
                    $sql = DB::select(
                        "SELECT * FROM books 
                        WHERE (status = 'loaned' AND genre LIKE '%$request->genre%')
                        AND (title LIKE '%$request->q%' OR author LIKE '%$request->author%')
                        ORDER BY author DESC
                        "
                    );
                    return new BookCollection($sql);
                    break;
                case "published_date,asc":
                    $sql = DB::select(
                        "SELECT * FROM books 
                        WHERE (status = 'loaned' AND genre LIKE '%$request->genre%')
                        AND (title LIKE '%$request->q%' OR author LIKE '%$request->author%')
                        ORDER BY published_date ASC
                        "
                    );
                    return new BookCollection($sql);
                    break;
                case "published_date,desc":
                    $sql = DB::select(
                        "SELECT * FROM books 
                        WHERE (status = 'loaned' AND genre LIKE '%$request->genre%')
                        AND (title LIKE '%$request->q%' OR author LIKE '%$request->author%')
                        ORDER BY published_date DESC
                        "
                    );
                    return new BookCollection($sql);
                    break;
                default:
                    $sql = DB::select(
                        "SELECT * FROM books 
                            WHERE (status = 'loaned' AND genre LIKE '%$request->genre%')
                            AND (title LIKE '%$request->q%' OR author LIKE '%$request->author%')
                            ORDER BY title ASC
                            "
                    );
                    return new BookCollection($sql);
            }

        }

        $books = Book::skip($offset)->limit($limit)->filter()->get();

        return new BookCollection($books);

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
    public function store(StoreBookRequest $request)
    {
        return new BookResource(Book::create($request->all()));
    }

    /**
     * Display the specified resource.
     */
    public function show(Book $book)
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
