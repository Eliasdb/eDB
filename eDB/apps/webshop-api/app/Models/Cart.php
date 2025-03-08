<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Cart extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'total_price']; // 🔹 Now includes `total_price`

    public function items()
    {
        return $this->hasMany(CartItem::class);
    }

    public function updateTotal()
    {
        $this->total_price = $this->items->sum(fn($item) => $item->selected_amount * $item->price);
        $this->save();
    }
}
