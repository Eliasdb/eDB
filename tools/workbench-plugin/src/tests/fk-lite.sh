#!/usr/bin/env bash
set -euo pipefail


# Usage:
# testing fk behaviors for gadgets → suppliers relation
#   fk-lite.sh cascade  http://127.0.0.1:9102
#   fk-lite.sh restrict http://127.0.0.1:9102
#   fk-lite.sh setNull  http://127.0.0.1:9102

MODE="${1:-}"
BASE="${2:-http://127.0.0.1:9102}"

case "${MODE}" in
  cascade|restrict|setNull) ;;
  *) echo "Usage: $0 <cascade|restrict|setNull> <BASE>"; exit 2;;
esac

HDR=(-H 'Content-Type: application/json' -sS)
have_jq=0; command -v jq >/dev/null 2>&1 && have_jq=1

post()      { curl "${HDR[@]}" -X POST "$1" -d "$2"; }
get_code()  { curl -sS -o /dev/null -w '%{http_code}' "$1"; }
del_code()  { curl -sS -o /dev/null -w '%{http_code}' -X DELETE "$1"; }
extract_id(){ # tries .supplier.id, .gadget.id, .id
  if (( have_jq )); then jq -r '.supplier.id // .gadget.id // .id // empty'
  else sed -n 's/.*"id":"\([0-9a-fA-F-]\{36\}\)".*/\1/p' | head -n1
  fi
}

echo "→ FK behavior smoke test: $MODE @ $BASE"

# 1) create supplier
SUP=$(post "$BASE/suppliers" '{"name":"Lite Supplier","country":"BE","rating":5,"contactEmail":"lite@test"}')
SID=$(printf "%s" "$SUP" | extract_id)
[[ -n "$SID" ]] || { echo "❌ supplier create failed"; echo "$SUP"; exit 1; }
echo "  ✓ supplierId=$SID"

# 2) create gadget referencing supplier
G_PAY=$(cat <<JSON
{"name":"Lite Gadget","category":"comms","supplierId":"$SID","weightGr":42}
JSON
)
GAD=$(post "$BASE/gadgets" "$G_PAY")
GID=$(printf "%s" "$GAD" | extract_id)
[[ -n "$GID" ]] || { echo "❌ gadget create failed"; echo "$GAD"; exit 1; }
echo "  ✓ gadgetId=$GID (supplierId=$SID)"

# 3) assert by mode
case "$MODE" in
  cascade)
    rc=$(del_code "$BASE/suppliers/$SID")
    [[ "$rc" == "200" || "$rc" == "204" ]] || { echo "❌ expected supplier delete success, got $rc"; exit 1; }
    code=$(get_code "$BASE/gadgets/$GID")
    [[ "$code" == "404" || "$code" == "410" ]] && echo "✅ cascade OK — gadget gone" || {
      echo "❌ cascade expected 404/410 for gadget, got $code"; exit 1; }
    ;;

  restrict)
    rc=$(del_code "$BASE/suppliers/$SID")
    if [[ "$rc" == "400" || "$rc" == "409" || "$rc" == "422" || "$rc" == "500" ]]; then
      echo "✅ restrict OK — supplier delete blocked ($rc)"
    else
      echo "❌ restrict expected failure code, got $rc"; exit 1
    fi
    # cleanup
    del_code "$BASE/gadgets/$GID" >/dev/null || true
    del_code "$BASE/suppliers/$SID" >/dev/null || true
    ;;

  setNull)
    rc=$(del_code "$BASE/suppliers/$SID")
    [[ "$rc" == "200" || "$rc" == "204" ]] || { echo "❌ expected supplier delete success, got $rc"; exit 1; }
    # read gadget and check supplierId became null/empty
    BODY=$(curl -sS "$BASE/gadgets/$GID" || true)
    SID_AFTER=$(
      if (( have_jq )); then printf "%s" "$BODY" | jq -r '.gadget.supplierId // empty'
      else printf "%s" "$BODY" | sed -n 's/.*"supplierId":\("null"\|null\|""\|"\([^"]*\)"\).*/\2/p'
      fi
    )
    if [[ -z "$SID_AFTER" ]]; then
      echo "✅ setNull OK — gadget.supplierId is null/empty"
    else
      echo "❌ setNull FAILED — supplierId still '$SID_AFTER'"; exit 1
    fi
    ;;
esac