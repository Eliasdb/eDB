<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Favourite extends Model
{
    use HasFactory;

    protected $fillable = [
        "title",
        "photo_url",
        "status",
        "genre",
        "description",
        "author",
        "published_date",
        "user_id",
        "original_id"

      ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
