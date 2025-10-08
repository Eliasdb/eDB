#!/usr/bin/env bash
set -euo pipefail

# Run from repo root; this script exports the Expo Web build (dev flavor)
# and copies it into the Angular app assets folder.

cd apps/mobile

###############################################################################
# 1) Load env for DEV
#    Priority: .env.development > .env (both inside apps/mobile/)
###############################################################################
ENV_USED="none"
set -a
if [ -f .env ]; then
  . ./.env
  ENV_USED=".env"
elif [ -f .env ]; then
  . ./.env
  ENV_USED=".env"
fi
set +a
echo "Loaded env file: ${ENV_USED}"

###############################################################################
# 2) Export web
###############################################################################
EXPO_PUBLIC_STORYBOOK=1 npx expo export --platform web --output-dir dist

###############################################################################
# 3) Find output dir
###############################################################################
OUT=""
for d in dist dist-web web-build .expo/web-build .expo/web; do
  if [ -f "$d/index.html" ]; then
    OUT="$d"
    break
  fi
done

if [ -z "$OUT" ]; then
  echo "No web export found" >&2
  exit 1
fi
echo "Expo web output at $OUT"

###############################################################################
# 4) Make asset URLs relative first (so the bundle is path-agnostic)
###############################################################################
node _tools/relativize-assets.mjs "$OUT"

###############################################################################
# 5) Flatten vector-icon fonts out of .pnpm into a regular folder
###############################################################################
node _tools/flatten-vector-icons.mjs "$OUT" "$OUT/fonts"

###############################################################################
# 6) Inject base href for where Angular serves it from (unchanged)
#    You can tweak the mount path for dev if needed, e.g. "/assets/clara-dev"
###############################################################################
BASE_PATH="/assets/clara"
node _tools/patch-index.mjs "$OUT/index.html" "$BASE_PATH" "${EXPO_PUBLIC_API_BASE:-}"

###############################################################################
# 7) Copy to Angular assets
###############################################################################
DEST="$(git rev-parse --show-toplevel)/apps/client/edb/src/assets/clara"
mkdir -p "$DEST"
rm -rf "$DEST"/* || true
cp -R "$OUT"/* "$DEST"/

echo "Copied web build to: $DEST"
echo "EXPO_PUBLIC_API_BASE=${EXPO_PUBLIC_API_BASE:-<unset>}"
