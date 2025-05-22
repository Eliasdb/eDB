package com.yourcompany.totp;

import org.keycloak.TokenVerifier;
import org.keycloak.common.VerificationException;
import org.keycloak.credential.CredentialModel;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.UserModel;
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

@Path("/totp-setup")   // final endpoint: /realms/{realm}/totp-setup
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class TotpSetupEndpoint {

  private final KeycloakSession session;
  public TotpSetupEndpoint(KeycloakSession s) { this.session = s; }
public record Begin(String secret, String uri, String qrImage) {}

  // ---------- STEP 1: GET -> return secret + otpauth + (QR if you want) ----------
@GET
@Produces(MediaType.APPLICATION_JSON)
public Response begin(@Context HttpHeaders headers) {
    String auth = headers.getHeaderString(HttpHeaders.AUTHORIZATION);
    if (auth == null || !auth.startsWith("Bearer ")) {
        return Response.status(Response.Status.UNAUTHORIZED).build();
    }

    String jwt = auth.substring("Bearer ".length());

    AccessToken token;
    try {
        token = TokenVerifier.create(jwt, AccessToken.class).getToken();
    } catch (VerificationException e) {
        return Response.status(Response.Status.UNAUTHORIZED).build();
    }

    UserModel user = session.users().getUserById(
        session.getContext().getRealm(),
        token.getSubject()
    );
    if (user == null) {
        return Response.status(Response.Status.UNAUTHORIZED).build();
    }

    String secret = user.getFirstAttribute("tmp_totp_secret");
    if (secret == null) {
        secret = TotpUtils.randomSecret();
        user.setSingleAttribute("tmp_totp_secret", secret);
    }

    String realm = session.getContext().getRealm().getName();
    String uri = "otpauth://totp/" + realm + ":" + user.getUsername()
               + "?secret=" + secret + "&issuer=" + realm;

String qrImage = QrUtils.toBase64Png(uri); // ✅ correct method name

    return Response.ok(new Begin(secret, uri, qrImage)).build();
}


  // ---------- STEP 2: POST code -> store credential ----------
  public static class Submit { public String code; public String label; }

@POST
public Response finish(@Context HttpHeaders headers, Submit s) {
    // 1 — Extract and verify bearer token
    String auth = headers.getHeaderString(HttpHeaders.AUTHORIZATION);
    if (auth == null || !auth.startsWith("Bearer ")) {
        return Response.status(Response.Status.UNAUTHORIZED).build();
    }

    String jwt = auth.substring("Bearer ".length());

    AccessToken token;
    try {
        token = TokenVerifier.create(jwt, AccessToken.class).getToken();
    } catch (VerificationException ex) {
        return Response.status(Response.Status.UNAUTHORIZED).build();
    }

    // 2 — Resolve user by ID
    UserModel user = session.users()
        .getUserById(session.getContext().getRealm(), token.getSubject());

    if (user == null) {
        return Response.status(Response.Status.UNAUTHORIZED).build();
    }

    // 3 — Validate submitted TOTP code against stored temporary secret
    String secret = user.getFirstAttribute("tmp_totp_secret");
    if (secret == null || !TotpUtils.verify(secret, s.code)) {
        return Response.status(400).entity("{\"error\":\"bad_code\"}").build();
    }

    // 4 — Store as credential
    CredentialModel cm = new CredentialModel();
    cm.setType("otp");
    cm.setSecretData("{\"secret\":\"" + secret + "\"}");
    cm.setCredentialData("{\"period\":30,\"digits\":6,\"algorithm\":\"HmacSHA1\"}");
    cm.setUserLabel(s.label == null ? "device" : s.label);

    user.credentialManager().createStoredCredential(cm);

    // 5 — Cleanup
    user.removeAttribute("tmp_totp_secret");

    return Response.noContent().build(); // 204
}


}
