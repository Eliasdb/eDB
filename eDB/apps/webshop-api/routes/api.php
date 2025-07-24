<?php

use App\Http\Controllers\Api\V1\AdminController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\BookController;
use App\Http\Controllers\Api\V1\AIController;
use App\Http\Controllers\Api\V1\CartController;
use App\Http\Controllers\Api\V1\OrderController;
use App\Http\Controllers\Api\V1\Admin\OrderAdminController;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Resources\V1\User\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// AUTHORIZED ROUTES
// Route::middleware('auth:sanctum')->get('/v1/user', function (Request $request) {
//     $includeFavourites = $request->query("includeFavourites");

//     $user = User::where('id', $request->user()->id)->first();

//     if ($includeFavourites) {
//         $user = $user->loadMissing("favourites");
//     }

//     return new UserResource($user);
// });

// PUBLIC ROUTES
Route::prefix('v1')->group(function () {
    Route::apiResource("books", BookController::class);
});

Route::post('/v1/search/books', [AIController::class, 'handle']);


// AUTHENTICATED USER ROUTES
Route::group([
  "prefix" => "v1",
  "middleware" => ["auth"]
], function () {
    // order routes
    Route::apiResource('orders', OrderController::class);

    // cart routes
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart/items', [CartController::class, 'addItem']);
    Route::patch('/cart/items/{itemId}', [CartController::class, 'updateItem']);
    Route::delete('/cart/items/{itemId}', [CartController::class, 'removeItem']);
});


// ADMIN ROUTES (AUTHENTICATED)
Route::prefix('v1/admin')->middleware('auth')->group(function () {
    Route::get('/orders', [OrderAdminController::class, 'index']);
});
