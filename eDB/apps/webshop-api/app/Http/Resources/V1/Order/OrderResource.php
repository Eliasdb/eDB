<?php

namespace App\Http\Resources\V1\Order;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray($request)
    {
        return [
            'id'         => $this->id,
            'userId'     => $this->user_id,
            'amount'     => $this->amount,
            'status'     => $this->status,
            'orderDate'  => $this->order_date,
            'createdAt'  => $this->created_at,
            'updatedAt'  => $this->updated_at,

            'fullName'   => $this->full_name,
            'address'    => $this->address,
            'city'       => $this->city,
            'postalCode' => $this->postal_code,
            'email'      => $this->email,

            'items'      => OrderItemResource::collection($this->whenLoaded('items')),
        ];
    }
}
