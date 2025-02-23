<?php

namespace App\Http\Resources\V1\User;

use App\Http\Resources\V1\Book\BookResource;
use App\Http\Resources\V1\Favourite\FavouriteResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "name" => $this->name,
            "firstName" => $this->first_name,
            "lastName" => $this->last_name,
            "email" => $this->email,
            "phoneNumber" => $this->phone_number,
            "address" => $this->address,
            "postalCode" => $this->postal_code,
            "city" => $this->city,
            "addedDate" => $this->created_at,
            "books" => BookResource::collection($this->whenLoaded("books")),
            "favourites" => FavouriteResource::collection($this->whenLoaded("favourites")),

        ];
    }
}
