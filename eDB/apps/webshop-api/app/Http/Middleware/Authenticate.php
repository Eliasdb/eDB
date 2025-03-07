<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Facades\JWTAuth;

class Authenticate
{
    public function handle(Request $request, Closure $next)
    {
        Log::info("🔹 Incoming Request", [
            'url'     => $request->fullUrl(),
            'cookies' => $request->cookies->all(),
            'jwt_data'=> $request->cookie('jwt'),
        ]);

        // Get JWT from the cookie
        $token = $request->cookie('jwt');

        if (!$token) {
            Log::warning("❌ No JWT found in cookies");
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        try {
            // Decode the JWT
            $payload = JWTAuth::setToken($token)->getPayload();
            Log::info("✅ Decoded JWT", (array) $payload);

            // Extract user ID from the token (assuming 'sub' contains user ID)
            $userId = $payload->get('sub');
            Log::info("✅ Extracted user ID", ['userId' => $userId]);

            if (!$userId) {
                Log::error("❌ JWT does not contain a valid 'sub' claim.");
                return response()->json(['error' => 'Invalid token payload'], 401);
            }

            // Attach the user id to the request for later use
            $request->attributes->set('jwt_user_id', $userId);
            Log::info("✅ JWT user ID set in request attributes", ['userId' => $userId]);

        } catch (\Exception $e) {
            Log::error("❌ JWT Decoding Failed: " . $e->getMessage());
            return response()->json(['error' => 'Invalid token'], 401);
        }

        return $next($request);
    }
}
