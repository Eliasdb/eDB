<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Http\Resources\V1\Cart\CartResource;

class CartController extends Controller
{
    // Retrieve the user's cart (eager-load items and books)
    public function index(Request $request)
    {
        // Assume the user is authenticated via JWT (as before)
        $token = $request->bearerToken();
        try {
            $payload = JWTAuth::setToken($token)->getPayload();
        } catch (\Exception $e) {
            return response()->json(['error' => 'Invalid token'], 401);
        }
        $userId = $payload->get('sub');

        // Find or create a cart for the user
        $cart = Cart::firstOrCreate(['user_id' => $userId]);
        $cart->load('items.book');
        
        return new CartResource($cart);
    }

    // Add an item to the cart
    public function addItem(Request $request)
    {
        $token = $request->bearerToken();
        try {
            $payload = JWTAuth::setToken($token)->getPayload();
        } catch (\Exception $e) {
            return response()->json(['error' => 'Invalid token'], 401);
        }
        $userId = $payload->get('sub');

        // Validate the incoming request; expect camelCase keys then transform if needed
        $data = $request->validate([
            'bookId' => 'required|exists:books,id',
            'quantity' => 'required|integer|min:1',
            'price' => 'required|numeric',
        ]);

        // Transform keys to snake_case
        $data['book_id'] = $data['bookId'];
        unset($data['bookId']);

        // Retrieve or create a cart for this user.
        $cart = Cart::firstOrCreate(['user_id' => $userId]);

        // Check if the item already exists in the cart. If so, update quantity.
        $cartItem = $cart->items()->where('book_id', $data['book_id'])->first();
        if ($cartItem) {
            $cartItem->update([
                'quantity' => $cartItem->quantity + $data['quantity'],
                'price' => $data['price'] // Optionally update price if it has changed
            ]);
        } else {
            $cart->items()->create($data);
        }

        $cart->load('items.book');
        return new CartResource($cart);
    }

    // Remove an item from the cart
    public function removeItem(Request $request, $itemId)
    {
        $token = $request->bearerToken();
        try {
            $payload = JWTAuth::setToken($token)->getPayload();
        } catch (\Exception $e) {
            return response()->json(['error' => 'Invalid token'], 401);
        }
        $userId = $payload->get('sub');

        $cart = Cart::firstOrCreate(['user_id' => $userId]);
        $item = $cart->items()->findOrFail($itemId);
        $item->delete();

        $cart->load('items.book');
        return new CartResource($cart);
    }

    // Optionally update an item's quantity in the cart.
    public function updateItem(Request $request, $itemId)
    {
        $token = $request->bearerToken();
        try {
            $payload = JWTAuth::setToken($token)->getPayload();
        } catch (\Exception $e) {
            return response()->json(['error' => 'Invalid token'], 401);
        }
        $userId = $payload->get('sub');

        $data = $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $cart = Cart::firstOrCreate(['user_id' => $userId]);
        $item = $cart->items()->findOrFail($itemId);
        $item->update($data);

        $cart->load('items.book');
        return new CartResource($cart);
    }
}
