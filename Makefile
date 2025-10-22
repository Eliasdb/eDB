# Location: ./Makefile
.SHELLFLAGS := -eu -o pipefail -c

# ---------- Vars ----------
DEVENV := _dev-env
AGENTS := _agents
EXT ?= uuid-ossp

# ---------- Phony ----------
.PHONY: dev-all dev-infra dev-nx \
        agent-db-create agent-db-drop agent-db-verify agent-db-list \
        create-db drop-db

# ---------- Infra / Nx (delegates to _dev-env/Makefile) ----------
dev-all dev-infra dev-nx:
	@$(MAKE) -C $(DEVENV) $@

# ---------- Agent DB helpers (manifest-style scripts) ----------
agent-db-create:
	@bash $(AGENTS)/scripts/db/create.sh --db "$(name)" --user "$(user)" --pass "$(pass)" --ext "$(EXT)"

agent-db-drop:
	@bash $(AGENTS)/scripts/db/drop.sh --db "$(name)" --user "$(user)" --yes

agent-db-verify:
	@bash _agents/scripts/db/verify.sh --db "$(name)" $(foreach e,$(exts),--ext $(e)) || test $$? -eq 4

.PHONY: 
agent-db-list:
	@bash _agents/scripts/db/list.sh $(if $(what),--what $(what)) $(if $(like),--like "$(like)")