<?php

namespace App\Http\Resources\V1\Book;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookResource extends JsonResource
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
            "photoUrl" => $this->photo_url,
            "description" => $this->description,
            "title" => $this->title,
            "genre" => $this->genre,
            "author" => $this->author,
            "status" => $this->status,
            "price" => $this->price,
            "stock" => $this->stock,
            "publishedDate" => $this->published_date,
        ];
    }
}
