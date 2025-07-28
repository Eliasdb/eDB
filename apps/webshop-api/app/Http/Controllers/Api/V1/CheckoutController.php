<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\CartService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;
use Stripe\Checkout\Session;
use Stripe\Stripe;
use App\Models\Order;
use Stripe\Checkout\Session as StripeSession;

class CheckoutController extends Controller
{
    protected CartService $cartService;

    public function __construct(CartService $cartService)
    {
        $this->middleware('auth');
        $this->cartService = $cartService;
    }

    /**
     * POST /api/v1/checkout-session
     * Creates a Stripe Checkout session
     */
    public function createCheckoutSession(Request $request): JsonResponse
    {
        $userId = $request->get('jwt_user_id');
        if (!$userId) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $validator = Validator::make($request->all(), [
            'fullName'    => 'required|string',
            'address'     => 'required|string',
            'city'        => 'required|string',
            'postalCode'  => 'required|string',
            'email'       => 'required|email',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Invalid input', 'messages' => $validator->errors()], 422);
        }

        $shipping = $validator->validated();

        $cart = $this->cartService->getCart($userId);
        if ($cart->items->isEmpty()) {
            return response()->json(['error' => 'Cart is empty'], 422);
        }

        $amount = $cart->items->sum(fn ($item) => $item->price * $item->selected_amount);
        if ($amount <= 0) {
            return response()->json(['error' => 'Invalid cart total'], 422);
        }

        // Save shipping data in cache for webhook
        Cache::put("checkout_user_{$userId}", $shipping, now()->addMinutes(30));

        // Create Stripe session
        Stripe::setApiKey(config('services.stripe.secret'));

        $session = Session::create([
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price_data' => [
                    'currency' => 'eur',
                    'product_data' => [
                        'name' => 'Book Order',
                    ],
                    'unit_amount' => (int) ($amount * 100),
                ],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'customer_email' => $shipping['email'],
            'metadata' => [
                'user_id' => $userId,
            ],
                'success_url' => 'http://localhost:4200/webshop/checkout/success?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => 'http://localhost:4200/webshop/checkout/cancel',
        ]);

        return response()->json(['url' => $session->url]);
    }

    public function handleCheckoutSuccess(Request $request): JsonResponse
    {
        $sessionId = $request->query('session_id');
        $userId = $request->get('jwt_user_id');

        if (!$userId) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        Stripe::setApiKey(config('services.stripe.secret'));

        try {
            $session = StripeSession::retrieve($sessionId);

            if ($session->payment_status !== 'paid') {
                return response()->json(['error' => 'Payment not completed'], 400);
            }

            $shipping = Cache::get("checkout_user_{$userId}");

            if (!$shipping) {
                return response()->json(['error' => 'Shipping data expired'], 410);
            }

            if ($existing = Order::where('stripe_session_id', $sessionId)->with('items.book')->first()) {
                return response()->json([
                    'message' => 'Order already recorded',
                    'order' => $existing,
                    'estimatedDelivery' => now()->addDays(3)->toDateString(),
                ]);
            }


            $cart = $this->cartService->getCart($userId);

            $order = Order::create([
                'user_id'     => $userId,
                'stripe_session_id' => $sessionId,
                'amount'      => $cart->items->sum(fn ($item) => $item->price * $item->selected_amount),
                'shipping_address' => json_encode($shipping),
                'status'      => 'paid',
                'order_date'  => now(), // ✅ Add this
                'full_name'   => $shipping['fullName'] ?? null,
                'address'     => $shipping['address'] ?? null,
                'city'        => $shipping['city'] ?? null,
                'postal_code' => $shipping['postalCode'] ?? null,
                'email'       => $shipping['email'] ?? null,
            ]);


            foreach ($cart->items as $item) {
                $order->items()->create([
                    'book_id' => $item->book_id,
                    'quantity' => $item->selected_amount,
                    'price' => $item->price,
                ]);
            }

            $this->cartService->clearCart($userId);

            // ✅ Eager-load items.book and return full order payload
            return response()->json([
                'message' => 'Order confirmed',
                'orderId' => $order->id,
                'order' => $order->load('items.book'),
                'estimatedDelivery' => now()->addDays(3)->toDateString(),
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Could not verify session', 'details' => $e->getMessage()], 500);
        }
    }

}
