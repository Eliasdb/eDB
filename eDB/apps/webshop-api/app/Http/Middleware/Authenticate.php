<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Firebase\JWT\JWT;
use Firebase\JWT\JWK;
use Exception;

class Authenticate
{
    public function handle(Request $request, Closure $next)
    {
        Log::info("🔹 Incoming Request", [
            'url' => $request->fullUrl(),
            'headers' => $request->headers->all(),
        ]);

        // ✅ Extract JWT from Authorization header
        $token = $request->bearerToken();

        if (!$token) {
            Log::warning("❌ No Bearer token found in Authorization header");
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        try {
            // 🔹 Fetch Keycloak JWKS (public keys)
            $jwksUri = config('keycloak.jwks_url'); // Make sure this exists
            $jwks = json_decode(file_get_contents($jwksUri), true);

            if (!$jwks || !isset($jwks['keys'])) {
                Log::error("❌ Failed to fetch JWKS keys from Keycloak");
                return response()->json(['error' => 'JWT verification failed'], 401);
            }

            // 🔹 Convert JWKS into usable keys
            $keys = JWK::parseKeySet($jwks);

            // 🔹 Decode JWT using Keycloak public keys
            $decoded = JWT::decode($token, $keys);

            Log::info("✅ Decoded JWT", (array) $decoded);

            // 🔹 Extract Keycloak user ID from 'sub' claim
            $userId = $decoded->sub ?? null;
            Log::info("✅ Extracted Keycloak user ID", ['userId' => $userId]);

            if (!$userId) {
                Log::error("❌ JWT does not contain a valid 'sub' claim.");
                return response()->json(['error' => 'Invalid token payload'], 401);
            }

            // 🔹 Attach Keycloak user ID to request attributes for later use
            $request->attributes->set('jwt_user_id', $userId);
            Log::info("✅ JWT user ID set in request attributes", ['userId' => $userId]);

        } catch (Exception $e) {
            Log::error("❌ JWT Decoding Failed: " . $e->getMessage());
            return response()->json(['error' => 'Invalid token'], 401);
        }

        return $next($request);
    }
}
