<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\Book;
use Exception;

class CartService
{
    /**
     * Get the cart for the given user, creating one if needed.
     *
     * @param int $userId
     * @return \App\Models\Cart
     */
    public function getCart($userId)
    {
        $cart = Cart::firstOrCreate(['user_id' => $userId]);
        $cart->load('items.book');
        return $cart;
    }

    /**
     * Add an item to the user's cart.
     *
     * @param int $userId
     * @param array $data
     * @return \App\Models\Cart
     * @throws Exception
     */
    public function addItem($userId, array $data)
    {
        // Find the book or fail.
        $book = Book::findOrFail($data['id']);

        // Check if there is enough stock
        if ($data['selected_amount'] > $book->stock) {
            throw new Exception("Only {$book->stock} items available in stock.");
        }

        // Prepare the data for cart item creation
        $data['price'] = $book->price;
        $data['book_id'] = $data['id'];
        unset($data['id']);

        // Get or create the user's cart
        $cart = Cart::firstOrCreate(['user_id' => $userId]);

        // Check if the book is already in the cart
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
     *
     * @param int $userId
     * @param int $itemId
     * @return \App\Models\Cart
     */
    public function removeItem($userId, $itemId)
    {
        $cart = Cart::firstOrCreate(['user_id' => $userId]);
        $item = $cart->items()->findOrFail($itemId);
        $item->delete();

        $cart->load('items.book');
        return $cart;
    }

    /**
     * Update an item in the user's cart.
     *
     * @param int $userId
     * @param int $itemId
     * @param array $data
     * @return \App\Models\Cart
     */
    public function updateItem($userId, $itemId, array $data)
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

}
