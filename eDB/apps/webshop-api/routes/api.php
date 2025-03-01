<?php

use App\Http\Controllers\Api\V1\AdminController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\BookController;
use App\Http\Controllers\Api\V1\CartController;
use App\Http\Controllers\Api\V1\OrderController;

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
Route::middleware('auth:sanctum')->get('/v1/user', function (Request $request) {
    $includeFavourites = $request->query("includeFavourites");

    $user = User::where('id', $request->user()->id)->first();

    if ($includeFavourites) {
        $user = $user->loadMissing("favourites");
    }

    return new UserResource($user);
});

Route::middleware('auth:sanctum')->put('/v1/user', function (UpdateUserRequest $request, User $user) {
    $user = $request->user();

    $user->update($request->all());

    return new UserResource($user);
});

// PUBLIC ROUTES
Route::group(["prefix" => "v1", "namespace" => "App\Http\Controllers\Api\V1"], function () {
    Route::apiResource("register", AuthController::class);
    Route::post("login", [AuthController::class, "login"]);
    Route::get("logout", [AuthController::class, "logout"]);
    Route::get("admin-stats", [AdminController::class, "adminStats"]);
    Route::apiResource("books", BookController::class);
    Route::apiResource('orders', OrderController::class);
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart/items', [CartController::class, 'addItem']);
    Route::patch('/cart/items/{itemId}', [CartController::class, 'updateItem']);
    Route::delete('/cart/items/{itemId}', [CartController::class, 'removeItem']);

});

// AUTHENTICATED ROUTES
Route::group([
    "prefix" => "v1",
    "namespace" => "App\Http\Controllers\Api\V1",
    "middleware" => ["auth:sanctum"]
], function () {
    Route::apiResource("users", AuthController::class);
    // Route::get("profile", [ApiController::class, "profile"]);
    // Route::get("refresh", [ApiController::class, "refreshToken"]);
});



