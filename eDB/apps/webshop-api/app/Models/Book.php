<?php

namespace App\Models;

use Mehradsadeghi\FilterQueryString\FilterQueryString;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;
    use FilterQueryString;

    protected $filters = [
        "in",
        "status",
        "sort",
        "title",
        "genre",
        "author",
        "like",
        "search",
        "published_date",
        "q",
    ];

    protected $fillable = [
        "title",
        "photo_url",
        "status",
        "genre",
        "price",
        "stock",
        "description",
        "author",
        "published_date",
    ];

    protected $casts = [
        'price' => 'float',
        'stock' => 'integer',
    ];

    public function genre($query, $value)
    {
        return $query->where('genre', 'ILIKE', "%$value%");
    }

    public function search($query, $value)
    {
        return $query->where(function ($q) use ($value) {
            $q->where('title', 'ilike', "%$value%")
              ->orWhere('author', 'ilike', "%$value%");
        });
    }

    public function author($query, $value)
    {
        return $query->where('author', 'like', "%$value%");
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
