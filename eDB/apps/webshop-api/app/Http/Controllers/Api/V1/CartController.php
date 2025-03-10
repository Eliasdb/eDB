<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCartItemRequest;
use Illuminate\Http\Request;
use App\Models\Cart;
use App\Http\Resources\V1\Cart\CartResource;
use App\Models\Book;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class CartController extends Controller
{
    public function index(Request $request)
    {
        $user_id = $request->get('jwt_user_id');


        if (!$user_id) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        Log::info("Fetching cart for user: {$user_id}");

        // Find or create a cart for the user
        $cart = Cart::firstOrCreate(['user_id' => $user_id]);
        $cart->load('items.book');

        return new CartResource($cart);
    }

    public function addItem(StoreCartItemRequest $request)
    {
        $user_id = $request->get('jwt_user_id');
        if (!$user_id) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        Log::info("Adding item to cart for user: {$user_id}");

        $data = $request->validated();

        $book = Book::findOrFail($data['id']);
        if ($data['selected_amount'] > $book->stock) {
            return response()->json(['error' => "Only {$book->stock} items available in stock."], 400);
        }
        
        $data['price'] = $book->price;
        // Map the book id to the expected foreign key column
        $data['book_id'] = $data['id'];
        unset($data['id']);
        
        $cart = Cart::firstOrCreate(['user_id' => $user_id]);
        $cartItem = $cart->items()->where('book_id', $data['book_id'])->first();
        
        if ($cartItem) {
            $newAmount = $cartItem->selected_amount + $data['selected_amount'];
        
            if ($newAmount > $book->stock) {
                return response()->json(['error' => "Not enough stock. Max allowed: {$book->stock}."], 400);
            }
        
            $cartItem->update(['selected_amount' => $newAmount]);
        } else {
            $cart->items()->create($data);
        }
        
        $cart->load('items.book');
        
        return new CartResource($cart);
        
    }

    public function removeItem(Request $request, $itemId)
    {
        $user_id = $request->get('jwt_user_id');
        if (!$user_id) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $cart = Cart::firstOrCreate(['user_id' => $user_id]);
        $item = $cart->items()->findOrFail($itemId);
        $item->delete();

        $cart->load('items.book');

        return new CartResource($cart);
    }

    public function updateItem(Request $request, $itemId)
    {
        $user_id = $request->get('jwt_user_id');
        if (!$user_id) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $data = $request->validate([
            'selectedAmount' => 'required|integer|min:1'
        ]);

        $cart = Cart::firstOrCreate(['user_id' => $user_id]);
        $item = $cart->items()->findOrFail($itemId);
        $item->update($data);

        $cart->load('items.book');

        return new CartResource($cart);
    }
}
