package com.yourcompany.totp;

import java.security.SecureRandom;

import org.keycloak.models.utils.Base32;
import org.keycloak.models.utils.TimeBasedOTP;

/**
 * Utility helpers for TOTP that match Keycloak’s default OTP policy
 * (SHA‑1, 6‑digit codes, 30‑second period).
 */
public final class TotpUtils {

    /** Re‑used RNG so we don’t reseed SecureRandom on every call. */
    private static final SecureRandom RNG = new SecureRandom();

    /** Time‑based OTP engine (HmacSHA1 · 6 digits · 30 seconds · window = 1). */
    private static final TimeBasedOTP OTP = new TimeBasedOTP();

    private TotpUtils() {
        /* utility class – prevent instantiation */
    }

    /**
     * Generates a new 160‑bit secret and returns it as an RFC‑4648 Base‑32 string
     * (uppercase A–Z and digits 2‑7, no padding).
     */
    public static String randomSecret() {
        byte[] seed = new byte[20];   // 160 bits
        RNG.nextBytes(seed);
        return Base32.encode(seed);   // → always A‑Z 2‑7
    }

    /**
     * Validates a user‑supplied TOTP code against the secret.
     * The secret stays Base‑32; TimeBasedOTP does the decoding internally.
     */
public static boolean verify(String secret, String code) {
    return OTP.validateTOTP(code, Base32.decode(secret));
}

}
