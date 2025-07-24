<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Book;
use App\Http\Resources\V1\Book\BookResource;

class SearchController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->input('q', '');
        $limit = (int) $request->input('limit', 15);
        $offset = (int) $request->input('offset', 0);

        if (!$query) {
            return response()->json([
                'error' => 'Missing search query.',
            ], 400);
        }

        $results = Book::search($query)
            ->take($limit)
            ->get();

        return response()->json([
            'query' => $query,
            'items' => BookResource::collection($results),
            'total' => $results->count(),
            'limit' => $limit,
            'offset' => $offset,
            'hasMore' => false, // You can implement Meili pagination later if needed
        ]);
    }
}
