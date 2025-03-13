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
    protected $cartService;
    protected $userId;

    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
        // Using middleware closure to capture jwt_user_id after middleware execution.
        $this->middleware(function ($request, $next) {
            $this->userId = $request->get('jwt_user_id');
            return $next($request);
        });
    }

    public function index()
    {
        $cart = $this->cartService->getCart($this->userId);
        return new CartResource($cart);
    }

    public function addItem(StoreCartItemRequest $request)
    {
        $data = $request->validated();

        try {
            $cart = $this->cartService->addItem($this->userId, $data);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }

        return new CartResource($cart);
    }

    public function removeItem($itemId)
    {
        $cart = $this->cartService->removeItem($this->userId, $itemId);
        return new CartResource($cart);
    }

    public function updateItem(Request $request, $itemId)
    {
        $data = $request->validate([
            'selectedAmount' => 'required|integer|min:1'
        ]);

        $cart = $this->cartService->updateItem($this->userId, $itemId, $data);
        return new CartResource($cart);
    }
}
