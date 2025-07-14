<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\Book;
use Exception;

class CartService
{
    /**
     * Get the cart for the given user, creating one if needed.
     */
    public function getCart(string $userId): Cart
    {
        $cart = Cart::firstOrCreate(['user_id' => $userId]);
        $cart->load('items.book');
        return $cart;
    }

    /**
     * Add an item to the user's cart.
     *
     * @throws Exception
     */
    public function addItem(string $userId, array $data): Cart
    {
        $book = Book::findOrFail($data['id']);

        if ($data['selected_amount'] > $book->stock) {
            throw new Exception("Only {$book->stock} items available in stock.");
        }

        $data['price'] = $book->price;
        $data['book_id'] = $data['id'];
        unset($data['id']);

        $cart = Cart::firstOrCreate(['user_id' => $userId]);

        $cartItem = $cart->items()->where('book_id', $data['book_id'])->first();

        if ($cartItem) {
            $newAmount = $cartItem->selected_amount + $data['selected_amount'];
            if ($newAmount > $book->stock) {
                throw new Exception("Not enough stock. Max allowed: {$book->stock}.");
            }
            $cartItem->update(['selected_amount' => $newAmount]);
        } else {
            $cart->items()->create($data);
        }

        $cart->load('items.book');
        return $cart;
    }

    /**
     * Remove an item from the user's cart.
     */
    public function removeItem(string $userId, int $itemId): Cart
    {
        $cart = Cart::firstOrCreate(['user_id' => $userId]);
        $item = $cart->items()->findOrFail($itemId);
        $item->delete();

        $cart->load('items.book');
        return $cart;
    }

    /**
     * Update an item in the user's cart.
     */
    public function updateItem(string $userId, int $itemId, array $data): Cart
    {
        if (isset($data['selectedAmount'])) {
            $data['selected_amount'] = $data['selectedAmount'];
            unset($data['selectedAmount']);
        }

        $cart = Cart::firstOrCreate(['user_id' => $userId]);
        $item = $cart->items()->findOrFail($itemId);
        $item->update($data);

        $cart->load('items.book');
        return $cart;
    }

    /**
     * Clear all items in the user's cart.
     */
    public function clearCart(string $userId): void
    {
        $cart = Cart::where('user_id', $userId)->first();

        if ($cart) {
            $cart->items()->delete();
        }
    }
}
