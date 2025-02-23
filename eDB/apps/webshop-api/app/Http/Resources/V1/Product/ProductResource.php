<?php

namespace App\Http\Resources\V1\Product;

use App\Http\Resources\V1\Comment\CommentResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
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
            "userId" => $this->user_id,
            "username" => $this->username,
            "photoUrl" => $this->photo_url,
            "content" => $this->content,
            "creationDate" => $this->created_at,
        ];
    }
}
