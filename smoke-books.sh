#!/usr/bin/env bash
set -euo pipefail
HOST=${HOST:-http://127.0.0.1:9102}
AUTHOR_ID=${AUTHOR_ID:-aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa}

echo "Creating book…"
BOOK_ID=$(curl -s -X POST "$HOST/books" \
  -H "Content-Type: application/json" \
  -d '{"title":"Smoke Test Book","authorId":"'"$AUTHOR_ID"'","status":"draft","publishedYear":2024}' \
  | jq -r '.book.id')
echo "BOOK_ID=$BOOK_ID"

echo "Listing…"; curl -s "$HOST/books?page=1&pageSize=5" | jq . > /dev/null
echo "Get one…"; curl -s "$HOST/books/$BOOK_ID" | jq . > /dev/null
echo "Update…";  curl -s -X PATCH "$HOST/books/$BOOK_ID" -H "Content-Type: application/json" -d '{"status":"published"}' | jq . > /dev/null
echo "By author…"; curl -s "$HOST/authors/$AUTHOR_ID/books?page=1&pageSize=5" | jq . > /dev/null
echo "Delete…"; curl -s -X DELETE "$HOST/books/$BOOK_ID" | jq . > /dev/null
echo "Expect 404…"; code=$(curl -s -o /dev/null -w "%{http_code}" "$HOST/books/$BOOK_ID"); [[ "$code" == "404" ]] || { echo "Expected 404, got $code"; exit 1; }
echo "✅ Books smoke test passed"
