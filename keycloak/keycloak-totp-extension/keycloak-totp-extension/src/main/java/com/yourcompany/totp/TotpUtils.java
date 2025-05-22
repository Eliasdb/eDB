package com.yourcompany.totp;

import org.keycloak.models.utils.Base32;
import org.keycloak.models.utils.TimeBasedOTP;

public final class TotpUtils {

    private static final TimeBasedOTP otp = new TimeBasedOTP();

    public static String randomSecret() {
        byte[] bytes = new byte[20]; // 160-bit secret
        new java.security.SecureRandom().nextBytes(bytes);
        return Base32.encode(bytes);
    }

    public static boolean verify(String secret, String code) {
        byte[] decodedSecret = Base32.decode(secret);
        return otp.validateTOTP(code, decodedSecret);
    }
}
