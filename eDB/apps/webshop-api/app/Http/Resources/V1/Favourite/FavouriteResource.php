<?php

namespace App\Http\Resources\V1\Favourite;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FavouriteResource extends JsonResource
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
            "userId" => $this->user_id,
            "originalId" => $this->original_id,
            "title" => $this->title,
            "genre" => $this->genre,
            "author" => $this->author,
            "status" => $this->status,
            "publishedDate" => $this->published_date,
            "lastLoanedDate" => $this->last_loaned_date,
        ];
    }
}
