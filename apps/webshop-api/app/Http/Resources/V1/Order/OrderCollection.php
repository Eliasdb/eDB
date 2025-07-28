<?php

namespace App\Http\Resources\V1\Order;

use Illuminate\Http\Resources\Json\ResourceCollection;

class OrderCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     */
    public function toArray($request)
    {
        return [
            'data' => $this->collection,
        ];
    }
    
    /**
     * Customize additional meta data if needed.
     */
    public function with($request)
    {
        return [
            'meta' => [
                'total' => $this->collection->count(),
            ],
        ];
    }
}
