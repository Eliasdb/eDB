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
        "published_date",
        "q",
    ];

    public function genre($query, $value)
{
    return $query->where('genre', 'ILIKE', "%$value%");
}


    public function q($query, $value)
    {
        // return $query->orWhere('name', '=', $value);
        return $query->orWhere('title', 'like', "%$value%");
    }

    public function author($query, $value)
    {
        // return $query->orWhere('name', '=', $value);
        return $query->orWhere('author', 'like', "%$value%");
    }

    protected $casts = [
        'price' => 'float',
        'stock' => 'integer',
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

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
    
}
