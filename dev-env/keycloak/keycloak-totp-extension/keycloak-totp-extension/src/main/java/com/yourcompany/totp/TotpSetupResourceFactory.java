package com.yourcompany.totp;

import org.keycloak.models.KeycloakSession;
import org.keycloak.models.KeycloakSessionFactory;
import org.keycloak.services.resource.RealmResourceProvider;
import org.keycloak.services.resource.RealmResourceProviderFactory;

public class TotpSetupResourceFactory implements RealmResourceProviderFactory {

    @Override
    public String getId() {
        return "totp-setup";
    }

    @Override
    public RealmResourceProvider create(KeycloakSession session) {
        return new RealmResourceProvider() {
            @Override
            public Object getResource() {
                return new TotpSetupEndpoint(session); // ✅ this must match
            }

            @Override
            public void close() {}
        };
    }

    @Override
    public void init(org.keycloak.Config.Scope config) {}
    @Override
    public void postInit(KeycloakSessionFactory factory) {}
    @Override
    public void close() {}
}
