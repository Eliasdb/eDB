<?php

namespace App\Http\Resources\V1\Comment;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "postId" => $this->post_id,
            "poster" => $this->poster,
            "content" => $this->content,
            "photoUrl" => $this->photo_url,
        ];
    }
}
