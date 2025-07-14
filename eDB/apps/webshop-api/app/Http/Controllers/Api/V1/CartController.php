<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCartItemRequest;
use Illuminate\Http\Request;
use App\Http\Resources\V1\Cart\CartResource;
use App\Services\CartService;
use Exception;

class CartController extends Controller
{
    public function __construct(protected CartService $cartService)
    {
        // Middleware should still run to inject jwt_user_id
        $this->middleware('auth'); // or whatever alias you use
    }

    public function index(Request $request)
    {
        $userId = $request->get('jwt_user_id');
        $cart = $this->cartService->getCart($userId);
        return new CartResource($cart);
    }

    public function addItem(StoreCartItemRequest $request)
    {
        $userId = $request->get('jwt_user_id');
        $data = $request->validated();

        try {
            $cart = $this->cartService->addItem($userId, $data);
            return new CartResource($cart);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function removeItem(Request $request, $itemId)
    {
        $userId = $request->get('jwt_user_id');
        $cart = $this->cartService->removeItem($userId, $itemId);
        return new CartResource($cart);
    }

    public function updateItem(Request $request, $itemId)
    {
        $userId = $request->get('jwt_user_id');

        $data = $request->validate([
            'selectedAmount' => 'required|integer|min:1',
        ]);

        $data['selected_amount'] = $data['selectedAmount'];
        unset($data['selectedAmount']);

        $cart = $this->cartService->updateItem($userId, $itemId, $data);
        return new CartResource($cart);
    }
}
