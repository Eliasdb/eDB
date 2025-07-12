<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'amount',
        'status',
        'order_date',
        'full_name',
        'address',
        'city',
        'postal_code',
        'email',
    ];

    public $incrementing = false; // 👈 disable auto-incrementing
    protected $keyType = 'string'; // 👈 treat id as UUID string

    protected static function booted()
    {
        static::creating(function ($order) {
            $order->id = (string) Str::uuid();
        });
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
