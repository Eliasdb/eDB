<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;
use Mehradsadeghi\FilterQueryString\FilterQueryString;

class Book extends Model
{
    use HasFactory;
    use FilterQueryString;
    use Searchable;

    protected $fillable = [
        'title',
        'photo_url',
        'status',
        'genre',
        'price',
        'stock',
        'description',
        'author',
        'published_date',
    ];

    protected $casts = [
        'price' => 'float',
        'stock' => 'integer',
    ];

    // Filters used by FilterQueryString (normal flow)
    protected $filters = [
        'in',
        'status',
        'sort',
        'title',
        'genre',
        'author',
        'like',
        'searchFilter',      // keep your renamed one
        'published_date',
        'q',
        'stock',
        'price',
    ];

    // ---------- Scout / Meilisearch ----------
    public function toSearchableArray(): array
    {
        return [
            'id'          => $this->id,
            'title'       => $this->title,
            'description' => $this->description,
            'author'      => $this->author,
            'genre'       => $this->genre,
            'status'      => $this->status,
            'published_date' => $this->published_date,
            'price'       => (float) $this->price,
            'stock'       => (int) $this->stock,
        ];
    }

    // ---------- FilterQueryString custom handlers (normal flow) ----------
    public function genre($query, $value)
    {
        return $query->where('genre', 'ILIKE', "%{$value}%");
    }

    public function searchFilter($query, $value)
    {
        return $query->where(function ($q) use ($value) {
            $q->where('title', 'ILIKE', "%{$value}%")
              ->orWhere('author', 'ILIKE', "%{$value}%")
              ->orWhere('description', 'ILIKE', "%{$value}%");
        });
    }

    public function author($query, $value)
    {
        return $query->where('author', 'ILIKE', "%{$value}%");
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
