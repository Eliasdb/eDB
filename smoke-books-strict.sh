#!/usr/bin/env bash
set -euo pipefail
HOST=${HOST:-http://127.0.0.1:9102}
AUTHOR_ID=${AUTHOR_ID:-aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa}

jget () { jq -r "$1" 2>/dev/null; }

status() { curl -s -o /dev/null -w "%{http_code}" "$@"; }

echo "Create…"
CREATE_JSON=$(curl -s -X POST "$HOST/books" \
  -H "Content-Type: application/json" \
  -d '{"title":"Smoke Test Book","authorId":"'"$AUTHOR_ID"'","status":"draft","publishedYear":2024}')
BOOK_ID=$(printf '%s' "$CREATE_JSON" | jget '.book.id')
[[ "$BOOK_ID" =~ ^[0-9a-f-]{36}$ ]] || { echo "Create failed: $CREATE_JSON"; exit 1; }

echo "List…"
code=$(status "$HOST/books?page=1&pageSize=5"); [[ "$code" == "200" ]] || { echo "List failed ($code)"; exit 1; }

echo "Get one…"
code=$(status "$HOST/books/$BOOK_ID"); [[ "$code" == "200" ]] || { echo "Get failed ($code)"; exit 1; }

echo "Update…"
code=$(curl -s -o /dev/null -w "%{http_code}" -X PATCH "$HOST/books/$BOOK_ID" \
  -H "Content-Type: application/json" -d '{"status":"published"}')
[[ "$code" == "200" ]] || { echo "Update failed ($code)"; exit 1; }

echo "By author…"
code=$(status "$HOST/authors/$AUTHOR_ID/books?page=1&pageSize=5")
[[ "$code" == "200" ]] || { echo "By-author route missing or failing ($code)"; exit 1; }

# Uncomment when the tags route is implemented:
# echo "Tags…"
# code=$(status "$HOST/books/$BOOK_ID/tags"); [[ "$code" == "200" ]] || { echo "Tags route missing ($code)"; exit 1; }

echo "Delete…"
code=$(status -X DELETE "$HOST/books/$BOOK_ID"); [[ "$code" == "200" ]] || { echo "Delete failed ($code)"; exit 1; }

echo "Expect 404 after delete…"
code=$(status "$HOST/books/$BOOK_ID"); [[ "$code" == "404" ]] || { echo "Expected 404, got $code"; exit 1; }

echo "✅ Strict books smoke test passed"
