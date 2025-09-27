#!/usr/bin/env bash
set -euo pipefail

cd apps/mobile

# 1) Load env
set -a
[ -f .env.staging ] && . ./.env.staging || true
set +a

# 2) Export web
npx expo export --platform web --output-dir dist

# 3) Find output dir
OUT=""
for d in dist dist-web web-build .expo/web-build .expo/web; do
  [ -f "$d/index.html" ] && OUT="$d" && break
done
[ -z "$OUT" ] && echo "No web export found" >&2 && exit 1
echo "Expo web output at $OUT"

# 4) FIRST: make asset URLs relative
node tools/relativize-assets.mjs "$OUT"

# 5) ⬅️ NEW: flatten vector-icon fonts out of .pnpm into a regular folder
node tools/flatten-vector-icons.mjs "$OUT" "$OUT/fonts"


# 5) THEN: inject absolute base so it stays '/assets/clara/'
node tools/patch-index.mjs "$OUT/index.html" "/assets/clara" "${EXPO_PUBLIC_API_BASE:-}"

# 6) Copy to Angular assets
DEST="$(git rev-parse --show-toplevel)/apps/client/edb/src/assets/clara"
mkdir -p "$DEST"; rm -rf "$DEST"/* || true
cp -R "$OUT"/* "$DEST"/
