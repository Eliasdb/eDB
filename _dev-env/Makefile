SHELL := /bin/bash

# iTerm automation helper
ITERM_APP ?= iTerm2
ITERM := script/iterm_tab.sh   # ./script/iterm_tab.sh <appName> "<tab title>" <command...>

# Compose config (infra stack)
COMPOSE := docker compose -f docker-compose.yml

# Raise the file-descriptor limit before spawning noisy Nx watchers to avoid EMFILE
NODE_FILE_LIMIT ?= 65536
ULIMIT_CMD := ulimit -n $(NODE_FILE_LIMIT) || true

.PHONY: dev-nx dev-nx-core dev-infra dev-all \
        platform-app admin-app platform-api admin-api \
        webshop-api invoices-api \
        rabbitmq meilisearch postgres keycloak pgadmin \
        infra-up infra-down infra-logs infra-restart create-db drop-db

# ── Individual Nx tabs ─────────────────────────────────────────

platform-app:
	$(ULIMIT_CMD); \
	NX_FILE_WATCHER=native \
	$(ITERM) $(ITERM_APP) "Platform App shell" \
	  nx run edb:serve-mf

admin-app:
	$(ULIMIT_CMD); \
	NX_FILE_WATCHER=native \
	NX_DAEMON=false \
	CHOKIDAR_USEPOLLING=1 CHOKIDAR_INTERVAL=1000 \
	WATCHPACK_POLLING=true WATCHPACK_POLL_INTERVAL=1000 WATCHPACK_AGGREGATE_TIMEOUT=200 \
	$(ITERM) $(ITERM_APP) "Admin MFE" \
	  nx run mfe-edb-admin:serve-mf


# Guarded .NET targets: set polling ONLY here
platform-api:
	$(ULIMIT_CMD); \
	$(ITERM) $(ITERM_APP) "Platform API" \
	  env DOTNET_USE_POLLING_FILE_WATCHER=1 nx run platform-api:serve

admin-api:
	$(ULIMIT_CMD); \
	$(ITERM) $(ITERM_APP) "Admin API" \
	  env DOTNET_USE_POLLING_FILE_WATCHER=1 nx run admin-api:serve


# Other services (no polling)
webshop-api:
	$(ULIMIT_CMD); \
	$(ITERM) $(ITERM_APP) "Webshop API"            nx serve webshop-api

invoices-api:
	$(ULIMIT_CMD); \
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

# Core dev set: app + ONLY the two guarded APIs
dev-nx-core: platform-app admin-app platform-api admin-api

# Full original set (if you ever need it)
dev-nx: platform-app admin-app platform-api admin-api webshop-api invoices-api

# Default all-in dev: infra + core (guarded)
dev-all: dev-infra dev-nx-core
