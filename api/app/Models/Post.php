<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Mehradsadeghi\FilterQueryString\FilterQueryString;

class Post extends Model
{
    use HasFactory;
    use FilterQueryString;


    protected $filters = [
        "user_id",
        "username",
        "content",
        "photo_url",
        "sort"
      ];

    protected $fillable = [
        "user_id",
        "username",
        "content",
        "photo_url",
      ];

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}
