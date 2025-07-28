<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Order\StoreOrderRequest;
use App\Http\Resources\V1\Order\OrderCollection;
use App\Http\Resources\V1\Order\OrderResource;
use App\Models\Order;
use App\Services\CartService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\JsonResponse;

class OrderController extends Controller
{
    public function __construct(protected CartService $cartService)
    {
        $this->middleware('auth'); // applies JWT middleware to extract jwt_user_id
    }

    /**
     * GET /orders — Paginated list of orders for the authenticated user
     */
    public function index(Request $request): OrderCollection|JsonResponse
    {
        $userId = $request->get('jwt_user_id');
        if (!$userId) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $orders = Order::with('items.book')
            ->where('user_id', $userId)
            ->latest()
            ->paginate(15);

        return new OrderCollection($orders);
    }

    /**
     * POST /orders — Create a new order from the cart
     */
    public function store(StoreOrderRequest $request): OrderResource|JsonResponse
    {
        $userId = $request->get('jwt_user_id');
        if (!$userId) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $cart = $this->cartService->getCart($userId);
        if ($cart->items->isEmpty()) {
            return response()->json(['error' => 'Cart is empty'], 422);
        }

        try {
            $order = DB::transaction(function () use ($request, $cart, $userId) {
                $order = Order::create([
                    'user_id'     => $userId,
                    'status'      => 'pending',
                    'order_date'  => $request->input('order_date') ?? now(),
                    'amount'      => $cart->items->sum(
                        fn ($item) => $item->price * $item->selected_amount
                    ),
                    'full_name'   => $request->input('fullName'),
                    'address'     => $request->input('address'),
                    'city'        => $request->input('city'),
                    'postal_code' => $request->input('postalCode'),
                    'email'       => $request->input('email'),
                ]);

                foreach ($cart->items as $item) {
                    $order->items()->create([
                        'book_id'  => $item->book_id,
                        'price'    => $item->price,
                        'quantity' => $item->selected_amount,
                    ]);
                }

                $this->cartService->clearCart($userId);

                return $order;
            });

            return new OrderResource($order->load('items.book'));
        } catch (\Throwable $e) {
            Log::error('❌ Order creation failed', [
                'user_id' => $userId,
                'error'   => $e->getMessage(),
            ]);

            return response()->json(['error' => 'Order creation failed'], 500);
        }
    }

    /**
     * GET /orders/{order}
     */
    public function show(Request $request, Order $order): OrderResource|JsonResponse
    {
        $userId = $request->get('jwt_user_id');

        if ($order->user_id !== $userId) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return new OrderResource($order->load('items.book'));
    }

    /**
     * PATCH /orders/{order}
     */
    public function update(Request $request, Order $order): OrderResource|JsonResponse
    {
        $userId = $request->get('jwt_user_id');

        if ($order->user_id !== $userId) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'quantity' => 'sometimes|integer|min:1',
            'status'   => 'sometimes|in:pending,completed,cancelled',
        ]);

        $order->update($validated);

        return new OrderResource($order);
    }

    /**
     * DELETE /orders/{order}
     */
    public function destroy(Request $request, Order $order): JsonResponse
    {
        $userId = $request->get('jwt_user_id');

        if ($order->user_id !== $userId) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $order->delete();

        return response()->json(['message' => 'Order deleted successfully.']);
    }
}
