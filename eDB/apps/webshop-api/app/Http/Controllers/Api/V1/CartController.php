<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCartItemRequest;
use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Http\Resources\V1\Cart\CartResource;
use App\Models\Book;

class CartController extends Controller
{
    // Retrieve the user's cart (eager-load items and books)
    public function index(Request $request)
    {
        // Retrieve the token from the Authorization header
        $token = $request->bearerToken();
        Log::info("Received token: " . $token);
    
        try {
            $payload = JWTAuth::setToken($token)->getPayload();
        } catch (\Exception $e) {
            Log::error("Token verification failed: " . $e->getMessage());
            return response()->json(['error' => 'Invalid token'], 401);
        }
        
        $userId = $payload->get('sub');
    
        // Find or create a cart for the user
        $cart = Cart::firstOrCreate(['user_id' => $userId]);
        $cart->load('items.book');
        
        return new CartResource($cart);
    }
    
    // Add an item to the cart
    public function addItem(StoreCartItemRequest $request)
    {
        $token = $request->bearerToken();
        try {
            $payload = JWTAuth::setToken($token)->getPayload();
        } catch (\Exception $e) {
            return response()->json(['error' => 'Invalid token'], 401);
        }
        $userId = $payload->get('sub');
    
        // 🔹 Log incoming request data
        Log::info('Incoming request:', $request->all());
    
        // Retrieve the validated data (automatically transformed by StoreCartItemRequest)
        $data = $request->validated();
    
        // 🔹 Log the validated request data
        Log::info('Validated request data:', $data);
    
        $data['book_id'] = $request->book_id;
        $data['selected_amount'] = $request->selected_amount;
    
        // 🔹 Fetch the book and check stock
        $book = Book::findOrFail($data['book_id']);
        Log::info("Fetched book: {$book->id}, Stock: {$book->stock}");
    
        if ($data['selected_amount'] > $book->stock) {
            Log::warning("User tried to add {$data['selected_amount']} items, but only {$book->stock} in stock.");
    
            return response()->json([
                'error' => "Only {$book->stock} items available in stock."
            ], 400);
        }
    
        // Set the price from the book
        $data['price'] = $book->price;
    
        // Retrieve or create a cart for this user.
        $cart = Cart::firstOrCreate(['user_id' => $userId]);
    
        // 🔹 Check if the item already exists in the cart
        $cartItem = $cart->items()->where('book_id', $data['book_id'])->first();
        if ($cartItem) {
            $newAmount = $cartItem->selected_amount + $data['selected_amount'];
    
            // 🔹 Log new calculated amount
            Log::info("Existing cart item found. Current: {$cartItem->selected_amount}, Requested: {$data['selected_amount']}, New: {$newAmount}, Stock: {$book->stock}");
    
            if ($newAmount > $book->stock) {
                Log::warning("New total {$newAmount} exceeds stock of {$book->stock}.");
    
                return response()->json([
                    'error' => "Not enough stock. Max allowed: {$book->stock}."
                ], 400);
            }
    
            $cartItem->update(['selected_amount' => $newAmount]);
        } else {
            // 🔹 Log new cart item creation
            Log::info("Creating new cart item with selected_amount = {$data['selected_amount']}");
    
            $cart->items()->create($data);
        }
    
        // 🔹 Load and return the updated cart
        $cart->load('items.book');
        Log::info("Cart updated successfully:", $cart->toArray());
    
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
            'selectedAmount' => 'required|integer|min:1'
        ]);
    

        $cart = Cart::firstOrCreate(['user_id' => $userId]);
        $item = $cart->items()->findOrFail($itemId);
        $item->update($data);

        $cart->load('items.book');
        return new CartResource($cart);
    }
}
