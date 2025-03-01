<?php

namespace App\Http\Resources\V1\Cart;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\V1\Cart\CartItemResource;

class CartResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'userId' => $this->user_id,
            'items' => CartItemResource::collection($this->whenLoaded('items')),
            'total' => $this->calculateTotal(), // 🔹 Add total price here
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
        ];
    }


private function calculateTotal()
{
    return $this->items->sum(fn($item) => $item->selected_amount * $item->book->price);
}
}
