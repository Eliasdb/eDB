#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   ./rel-switch.sh [cascade|restrict|setNull] [BASE_URL]
# Examples:
#   ./rel-switch.sh cascade
#   BASE=http://localhost:9101 ./rel-switch.sh setNull
#   ./rel-switch.sh restrict http://localhost:9102

MODE=$(echo "${1:-cascade}" | tr '[:upper:]' '[:lower:]')  # cascade|restrict|setnull
BASE="${BASE:-${2:-http://localhost:9102}}"

PLUGIN="@edb-workbench/plugin"
CHILD="gadgets"
PARENT="suppliers"
FK="supplierId"
INCLUDE="supplier"
SELECT="id,name,rating,country"

# Paths
INFRA_MIG_SCRIPT="libs/server/workbench-api/infra/src/lib/db/scripts/runMigrations.local.cjs"
CONTRACT_JSON="libs/server/workbench-api/models/src/contracts/gadget.contract.json"

HDR="Content-Type: application/json"

have_jq=0; command -v jq >/dev/null 2>&1 && have_jq=1

say() { echo "• $*"; }
status() { echo "→ $*"; }

extract_id () {
  local body="$1"
  if [ "$have_jq" -eq 1 ]; then
    jq -r '.id // .supplier.id // .gadget.id // empty' 2>/dev/null <<<"$body"
  else
    printf "%s" "$body" | sed -n 's/.*"id":"\([0-9a-fA-F-]\{36\}\)".*/\1/p' | head -n1
  fi
}

http_post () { # url json -> "code tmpfile"
  local url="$1" payload="$2" tmp code
  tmp=$(mktemp)
  code=$(curl -sS -w "%{http_code}" -o "$tmp" -X POST "$url" -H "$HDR" -d "$payload")
  echo "$code $tmp"
}
http_code () { curl -sS -o /dev/null -w "%{http_code}" "$1"; }
http_del_code () { curl -sS -o /dev/null -w "%{http_code}" -X DELETE "$1"; }

make_fk_required () {
node - <<'JS'
const fs=require('fs');const p='libs/server/workbench-api/models/src/contracts/gadget.contract.json';
const j=JSON.parse(fs.readFileSync(p,'utf8'));
let f=j.fields.find(x=>x.fieldName==='supplierId');
if(!f){ f={fieldName:'supplierId',required:true,tsType:'string',zodBase:'z.string().uuid()'}; j.fields.push(f); }
f.required=true;
const parts=(j.fieldsString||'').split(',').map(s=>s.trim()).filter(Boolean)
  .filter(x=>!x.startsWith('supplierId:') && !x.startsWith('supplierId?'));
if(!parts.includes('supplierId:uuid')) parts.push('supplierId:uuid');
j.fieldsString=parts.join(',');
fs.writeFileSync(p,JSON.stringify(j,null,2));
console.log('supplierId => required');
JS
}

make_fk_optional () {
node - <<'JS'
const fs=require('fs');const p='libs/server/workbench-api/models/src/contracts/gadget.contract.json';
const j=JSON.parse(fs.readFileSync(p,'utf8'));
let f=j.fields.find(x=>x.fieldName==='supplierId');
if(!f){ f={fieldName:'supplierId',required:false,tsType:'string',zodBase:'z.string().uuid()'}; j.fields.push(f); }
f.required=false;
const parts=(j.fieldsString||'').split(',').map(s=>s.trim()).filter(Boolean)
  .filter(x=>!x.startsWith('supplierId:') && !x.startsWith('supplierId?'));
if(!parts.includes('supplierId?:uuid')) parts.push('supplierId?:uuid');
j.fieldsString=parts.join(',');
fs.writeFileSync(p,JSON.stringify(j,null,2));
console.log('supplierId => optional');
JS
}

smoke_test_cascade () {
  say "Smoke test: CASCADE"
  read -r sc stmp < <(http_post "$BASE/suppliers" '{"name":"S-CASCADE"}')
  [ "$sc" = "200" ] || [ "$sc" = "201" ] || { echo "supplier create failed ($sc)"; cat "$stmp"; exit 1; }
  sid=$(extract_id "$(cat "$stmp")"); rm -f "$stmp"
  read -r gc gtmp < <(http_post "$BASE/gadgets" "{\"name\":\"G-CASCADE\",\"category\":\"comms\",\"supplierId\":\"$sid\"}")
  [ "$gc" = "200" ] || [ "$gc" = "201" ] || { echo "gadget create failed ($gc)"; cat "$gtmp"; exit 1; }
  gid=$(extract_id "$(cat "$gtmp")"); rm -f "$gtmp"
  code=$(http_code "$BASE/gadgets/$gid"); echo "  GET gadget → $code"
  del=$(http_del_code "$BASE/suppliers/$sid"); echo "  DELETE supplier → $del"
  after=$(http_code "$BASE/gadgets/$gid"); echo "  GET gadget after → $after"
  if [[ "$after" == "404" || "$after" == "410" ]]; then echo "✅ CASCADE OK"; else echo "❌ CASCADE failed"; exit 1; fi
}

smoke_test_restrict () {
  say "Smoke test: RESTRICT"
  read -r sc stmp < <(http_post "$BASE/suppliers" '{"name":"S-RESTRICT"}')
  sid=$(extract_id "$(cat "$stmp")"); rm -f "$stmp"
  read -r gc gtmp < <(http_post "$BASE/gadgets" "{\"name\":\"G-RESTRICT\",\"category\":\"comms\",\"supplierId\":\"$sid\"}")
  gid=$(extract_id "$(cat "$gtmp")"); rm -f "$gtmp"
  del=$(http_del_code "$BASE/suppliers/$sid"); echo "  DELETE supplier → $del"
  gcode=$(http_code "$BASE/gadgets/$gid"); echo "  GET gadget → $gcode"
  if [[ "$gcode" == "200" && "$del" != "200" && "$del" != "204" ]]; then echo "✅ RESTRICT OK"; else echo "❌ RESTRICT failed"; exit 1; fi
}

smoke_test_setnull () {
  say "Smoke test: SET NULL"
  read -r sc stmp < <(http_post "$BASE/suppliers" '{"name":"S-NULL"}')
  sid=$(extract_id "$(cat "$stmp")"); rm -f "$stmp"
  read -r gc gtmp < <(http_post "$BASE/gadgets" "{\"name\":\"G-NULL\",\"category\":\"comms\",\"supplierId\":\"$sid\"}")
  gid=$(extract_id "$(cat "$gtmp")"); rm -f "$gtmp"
  del=$(http_del_code "$BASE/suppliers/$sid"); echo "  DELETE supplier → $del"
  body=$(curl -sS "$BASE/gadgets/$gid"); code=$(http_code "$BASE/gadgets/$gid"); echo "  GET gadget → $code"
  if echo "$body" | grep -q '"supplierId":null'; then echo "✅ SET NULL OK"; else echo "❌ SET NULL failed"; echo "Body: $body"; exit 1; fi
}

# ──────────────────────────────────────────────────────────────────────────────
say "Build plugin"
pnpm nx build workbench-plugin

say "Ensure models/resources/infra exist"
pnpm nx g "$PLUGIN:workbench-api-model" --name="$PARENT"  --fields="name:string,country?:string,rating?:number,contactEmail?:string" || true
pnpm nx g "$PLUGIN:workbench-api-model" --name="$CHILD"   --fields="name:string,category:enum(surveillance|infiltration|comms|medical),weightGr?:number,discontinued?:boolean,releasedAt?:date" || true
pnpm nx g "$PLUGIN:workbench-api-resource" --name="$PARENT" || true
pnpm nx g "$PLUGIN:workbench-api-resource" --name="$CHILD"  || true
pnpm nx g "$PLUGIN:workbench-api-infra"    --name="$PARENT" || true
pnpm nx g "$PLUGIN:workbench-api-infra"    --name="$CHILD"  || true

say "Revert previous $CHILD → $PARENT relation (idempotent)"
pnpm nx g "$PLUGIN:workbench-api-rel" --belongsTo="$CHILD:$PARENT" --fk="$FK" --include="$INCLUDE" --revert || true

# Requiredness + onDelete
case "$MODE" in
  cascade)
    make_fk_required
    ONDEL="cascade"
    ;;
  restrict)
    make_fk_required
    ONDEL="restrict"
    ;;
  setnull)
    make_fk_optional
    ONDEL="setNull"
    ;;
  *)
    echo "Invalid mode: $MODE (use cascade|restrict|setNull)"; exit 2;;
esac

say "Apply relation ($CHILD belongsTo $PARENT, fk=$FK, onDelete=$ONDEL)"
pnpm nx g "$PLUGIN:workbench-api-rel" \
  --belongsTo="$CHILD:$PARENT" \
  --fk="$FK" \
  --include="$INCLUDE" \
  --onDelete="$ONDEL" \
  --select="$SELECT"

say "Run migrations"
pnpm nx run workbench-api-infra:migrations:generate -- --yes || pnpm nx run workbench-api-infra:migrations:generate
# Prefer Nx, but fall back to direct runner if Nx cache/plugin is cranky
if ! pnpm nx run workbench-api-infra:migrate; then
  status "Nx migrate failed; running direct script"
  node "$INFRA_MIG_SCRIPT"
fi

say "BASE = $BASE"
case "$MODE" in
  cascade)  smoke_test_cascade ;;
  restrict) smoke_test_restrict ;;
  setnull)  smoke_test_setnull ;;
esac

echo "✅ Done: $MODE"