<?php

namespace App\Http\Resources\V1\Order;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray($request)
    {
        return [
            'id'       => $this->id,
            'bookId'   => $this->book_id,
            'quantity' => $this->quantity,
            'price'    => $this->price,
            'book'     => new \App\Http\Resources\V1\Book\BookResource($this->whenLoaded('book')),
        ];
    }
}
