package com.yourcompany.totp;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.keycloak.TokenVerifier;
import org.keycloak.common.VerificationException;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.OTPPolicy;
import org.keycloak.models.UserModel;
import org.keycloak.models.credential.OTPCredentialModel;
import org.keycloak.representations.AccessToken;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

/**
 *  Exposed as:
 *    /realms/{realm}/totp-setup
 */
@Path("/totp-setup")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class TotpSetupEndpoint {

    /* ────────── DTOs ────────── */
    public record Begin(String secret, String uri, String qrImage) {}
    public record Submit(String code, String label) {}
    public record LinkedDevice(String label, long created) {}

    /* ────────── state ───────── */
    private final KeycloakSession session;

    public TotpSetupEndpoint(KeycloakSession session) {
        this.session = session;
    }

    /* ────────── helpers ───────── */
    private static String enc(String s) {
        return URLEncoder.encode(s, StandardCharsets.UTF_8).replace("+", "%20");
    }

    private static Response unauthorized() {
        return Response.status(Response.Status.UNAUTHORIZED).build();
    }

    /** Resolve a bearer token → UserModel (or {@code null}). */
    private UserModel resolveUser(HttpHeaders headers) {
        String auth = headers.getHeaderString(HttpHeaders.AUTHORIZATION);
        if (auth == null || !auth.startsWith("Bearer ")) return null;

        try {
            AccessToken tok = TokenVerifier.create(auth.substring(7), AccessToken.class).getToken();
            return session.users().getUserById(session.getContext().getRealm(), tok.getSubject());
        } catch (VerificationException e) {
            return null;
        }
    }

    /* ────────── 1 · GET  → generate secret + QR ────────── */
    @GET
    public Response begin(@Context HttpHeaders headers) {
        UserModel user = resolveUser(headers);
        if (user == null) return unauthorized();

        String secret = user.getFirstAttribute("tmp_totp_secret");
        if (secret == null) {
            secret = TotpUtils.randomSecret();
            user.setSingleAttribute("tmp_totp_secret", secret);
        }

        String realmName = session.getContext().getRealm().getName();
        OTPPolicy policy = session.getContext().getRealm().getOTPPolicy();

        // Build URI exactly like Keycloak’s stock page — raw label, no extra encoding
        String uri = "otpauth://totp/" + realmName + ":" + user.getUsername() +
                "?secret=" + secret +
                "&issuer=" + realmName +
                "&algorithm=" + policy.getAlgorithm().replaceFirst("^Hmac", "") +
                "&digits=" + policy.getDigits() +
                "&period=" + policy.getPeriod();

                System.out.println("GET secret = " + secret);

        return Response.ok(new Begin(secret, uri, QrUtils.toBase64Png(uri))).build();
    }

    /* ────────── 2 · POST → verify code & persist ───────── */
    @POST
    public Response finish(@Context HttpHeaders headers, Submit req) {
        UserModel user = resolveUser(headers);
        if (user == null) return unauthorized();

        String secret = user.getFirstAttribute("tmp_totp_secret");
        if (secret == null || !TotpUtils.verify(secret, req.code()))
            return Response.status(400).entity("{\"error\":\"bad_code\"}").build();

        // OTPPolicy policy = session.getContext().getRealm().getOTPPolicy();

     OTPCredentialModel otp = OTPCredentialModel.createFromPolicy(
            session.getContext().getRealm(), secret,
            req.label() == null ? "device" : req.label());

        otp.setUserLabel(req.label() == null ? "device" : req.label());
System.out.println("POST secret = " + secret);
        user.credentialManager().createStoredCredential(otp);
        user.removeRequiredAction(UserModel.RequiredAction.CONFIGURE_TOTP);
        user.removeAttribute("tmp_totp_secret");
        return Response.noContent().build();
    }

    /* ────────── 3 · GET /devices → list authenticators ─── */
    @GET @Path("/devices")
    public Response list(@Context HttpHeaders headers) {
        UserModel user = resolveUser(headers);
        if (user == null) return unauthorized();

        var devices = user.credentialManager()
                          .getStoredCredentialsByTypeStream(OTPCredentialModel.TYPE)
                          .map(c -> new LinkedDevice(
                                  c.getUserLabel() == null ? "(unnamed)" : c.getUserLabel(),
                                  c.getCreatedDate() == null ? 0L         : c.getCreatedDate()))
                          .toList();

        return Response.ok(devices).build();
    }
}
