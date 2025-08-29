package com.yourcompany.totp;

import org.keycloak.models.KeycloakSession;
import org.keycloak.services.resource.RealmResourceProvider;

public class TotpSetupResource implements RealmResourceProvider {

    private final KeycloakSession session;

    public TotpSetupResource(KeycloakSession session) {
        this.session = session;
    }

    @Override
    public Object getResource() {
        return new TotpSetupEndpoint(session); // 👈 important: return the REST resource
    }

    @Override
    public void close() {}
}
