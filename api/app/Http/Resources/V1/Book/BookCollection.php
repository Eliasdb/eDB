<?php

namespace App\Http\Resources\V1\Book;

use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Support\Facades\DB;

class BookCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array
    {

        $page_total = count(Book::filter()->get());

        if ($request->status == 'loaned') {
            $sql = DB::select("SELECT * FROM books 
            WHERE (status = 'loaned' AND genre LIKE '%$request->genre%')
            AND (title LIKE '%$request->q%' OR author LIKE '%$request->author%')
          
            ");
            $page_total = count($sql);

        }

        // return parent::toArray($request);
        // if ($request->status == 'loaned') {

        // }


        return [
            'data' => [
                'items' => parent::toArray($request),
                'count' => $page_total
            ],

        ];


    }

    //  /**
    // * Get additional data that should be returned with the resource array.
    // *
    // * @param  \Illuminate\Http\Request  $request
    // * @return array
    // */
    // public function with($request)
    // {
    //     $total = count(Book::all());


    //     return [
    //         'count' => $page_total
    //         // 'count' => [
    //         //     'all_total' => $total,
    //         //     'page_total' => $page_total,
    //         //     // 'offset' => (int)$request->offset,
    //         //     // 'limit' => (int)$request->limit,
    //         // ],
    //     ];
    // }
}
