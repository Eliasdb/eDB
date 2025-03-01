<?php

namespace App\Http\Resources\V1\Cart;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\V1\Book\BookResource;

class CartItemResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'bookId' => $this->book_id,
            'selectedAmount' => $this->selected_amount,
            'book' => new BookResource($this->whenLoaded('book')),
        ];
    }
}
