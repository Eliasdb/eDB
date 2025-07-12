<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'book_id',
        'quantity',
        'price',
    ];

    public $incrementing = false; // optional, only if you're using UUIDs for order_items.id
    protected $keyType = 'string'; // optional

    protected $casts = [
       'order_id' => 'string', // ✅ correct for UUIDs
];


    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function book()
    {
        return $this->belongsTo(Book::class);
    }
}
