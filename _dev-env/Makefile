SHELL := /bin/bash

# iTerm automation helper
ITERM_APP ?= iTerm2
ITERM := script/iterm_tab.sh   # ./script/iterm_tab.sh <appName> "<tab title>" <command...>

# Compose config (infra stack)
COMPOSE := docker compose -f docker-compose.yml
# If you ever move env vars to a separate file:
# COMPOSE := docker compose -f docker-compose.yml --env-file .env

.PHONY: dev-nx dev-infra dev-all \
        platform-app platform-api webshop-api admin-api invoices-api \
        rabbitmq meilisearch postgres keycloak pgadmin \
        infra-up infra-down infra-logs infra-restart create-db drop-db


# ── Individual Nx tabs ─────────────────────────────────────────
platform-app:
	$(ITERM) $(ITERM_APP) "Platform + Admin App"   nx run eDB:serve --devRemotes=mfe-edb-admin

platform-api:
	$(ITERM) $(ITERM_APP) "Platform API"           nx serve platform-api

webshop-api:
	$(ITERM) $(ITERM_APP) "Webshop API"            nx serve webshop-api

admin-api:
	$(ITERM) $(ITERM_APP) "Admin API"              nx serve admin-api

invoices-api:
	$(ITERM) $(ITERM_APP) "Invoices API"           nx serve tools-invoices-api


# ── Infra via docker compose ───────────────────────────────────
rabbitmq:
	$(COMPOSE) up -d rabbitmq
	$(ITERM) $(ITERM_APP) "RabbitMQ"               $(COMPOSE) logs -f rabbitmq

meilisearch:
	$(COMPOSE) up -d meilisearch
	$(ITERM) $(ITERM_APP) "Meilisearch"            $(COMPOSE) logs -f meilisearch

postgres:
	$(COMPOSE) up -d postgres
	$(ITERM) $(ITERM_APP) "Postgres"               $(COMPOSE) logs -f postgres

keycloak:
	$(COMPOSE) up -d keycloak
	$(ITERM) $(ITERM_APP) "Keycloak"               $(COMPOSE) logs -f keycloak

pgadmin:
	$(COMPOSE) up -d pgadmin
	$(ITERM) $(ITERM_APP) "pgAdmin"                $(COMPOSE) logs -f pgadmin


# ── Combined dev targets ───────────────────────────────────────
dev-infra:
	$(COMPOSE) up -d postgres keycloak meilisearch rabbitmq pgadmin

infra-up:
	$(COMPOSE) up -d

infra-logs:
	$(COMPOSE) logs -f

infra-restart:
	$(COMPOSE) restart

infra-down:
	$(COMPOSE) down

# ── Nx grouped commands ────────────────────────────────────────
dev-nx: platform-app platform-api webshop-api admin-api invoices-api
dev-all: dev-infra dev-nx