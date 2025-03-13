<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
         'user_id', 'book_id', 'quantity', 'amount', 'status', 'order_date'
    ];
    
    // Each order belongs to a user.
    public function user()
    {
         return $this->belongsTo(User::class);
    }
    
    // Each order belongs to a book.
    public function book()
    {
         return $this->belongsTo(Book::class);
    }

    public function items()
{
    return $this->hasMany(OrderItem::class);
}


    
}
