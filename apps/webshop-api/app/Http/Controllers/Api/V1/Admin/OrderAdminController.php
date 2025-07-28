<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\Order\OrderCollection;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderAdminController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
        // Optionally also check for admin role/guard here
    }

    /**
     * GET /admin/orders — All orders across all users
     */
    public function index(Request $request): OrderCollection
    {
        $orders = Order::with(['items.book', 'user']) // eager load related models
            ->latest()
            ->paginate(20); // or 50, adjustable

        return new OrderCollection($orders);
    }
}
