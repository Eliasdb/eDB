<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Order\StoreOrderRequest;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Http\Resources\V1\Order\OrderResource;
use App\Http\Resources\V1\Order\OrderCollection;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Facades\JWTAuth;


class OrderController extends Controller
{
    // List orders (with pagination)
    public function index()
    {
     $orders = Order::with('items.book')->paginate(15);
         return new OrderCollection($orders);
    }

    // Create a new order
    public function store(StoreOrderRequest $request)
    {
        // The request is already validated here.
        $validated = $request->validated();
    
        // Wrap only the JWT decoding (and optionally order creation) in try/catch.
        try {
            $token = $request->bearerToken();
            $payload = JWTAuth::setToken($token)->getPayload();
        } catch (\Exception $e) {
            Log::error('JWT error:', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Invalid token'], 401);
        }
        
        $userId = $payload->get('sub');
    
        try {
            // Create order with validated data and associated order items
            $order = Order::create([
                'user_id'   => $userId,
                'status'    => 'pending',
                'order_date'=> $validated['order_date'] ?? now(),
                'amount'    => collect($validated['items'])->sum(fn($item) => $item['price'] * $item['quantity']),
            ]);
    
            foreach ($validated['items'] as $itemData) {
                $order->items()->create($itemData);
            }
    
            return new OrderResource($order->load('items.book'));
        } catch (\Exception $e) {
            Log::error('Error creating order:', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Order creation failed'], 500);
        }
    }
    
    

    // Show a single order
    public function show(Order $order)
    {
          $order->load('items.book');
         return new OrderResource($order);
    }

    // Update an order
    public function update(Request $request, Order $order)
    {
         $validated = $request->validate([
             'quantity' => 'sometimes|integer|min:1',
             'status'   => 'sometimes|in:pending,completed,cancelled',
         ]);

         $order->update($validated);
         return new OrderResource($order);
    }

    // Delete an order
    public function destroy(Order $order)
    {
         $order->delete();
         return response()->json(['message' => 'Order deleted successfully.']);
    }
}
