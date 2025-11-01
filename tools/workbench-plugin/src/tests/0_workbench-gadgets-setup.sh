#!/usr/bin/env bash
set -euo pipefail

PLUGIN="@edb-workbench/plugin"

echo "• Build plugin"
pnpm nx build workbench-plugin

echo "• Generate NEW models (suppliers, gadgets)"
pnpm nx g "$PLUGIN:workbench-api-model" --name=suppliers \
  --fields="name:string,country?:string,rating?:number,contactEmail?:string"
pnpm nx g "$PLUGIN:workbench-api-model" --name=gadgets \
  --fields="name:string,category:enum(surveillance|infiltration|comms|medical),weightGr?:number,discontinued?:boolean,releasedAt?:date"

echo "• Generate resources"
pnpm nx g "$PLUGIN:workbench-api-resource" --name=suppliers
pnpm nx g "$PLUGIN:workbench-api-resource" --name=gadgets

echo "• Generate infra"
pnpm nx g "$PLUGIN:workbench-api-infra" --name=suppliers
pnpm nx g "$PLUGIN:workbench-api-infra" --name=gadgets

echo "• Wire relationship gadgets -> suppliers (fk=supplierId, include=supplier)"
pnpm nx g "$PLUGIN:workbench-api-rel" \
  --belongsTo="gadgets:suppliers" \
  --fk="supplierId" \
  --include="supplier" \
  --onDelete="cascade" \
  --select="id,name,rating,country"

echo "• Run migrations"
# --yes is best-effort; if your drizzle-kit version doesn't support it, it will ignore and still prompt interactively.
pnpm nx run workbench-api-infra:migrations:generate -- --yes || pnpm nx run workbench-api-infra:migrations:generate
pnpm nx run workbench-api-infra:migrate

echo
echo "Setup complete ✅"
echo "Now start the API in another terminal:"
echo "  pnpm nx serve workbench-api"