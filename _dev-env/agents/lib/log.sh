#!/usr/bin/env bash
set -euo pipefail
info(){ echo "ℹ️  $*" >&2; }
ok(){   echo "✅ $*" >&2; }
warn(){ echo "⚠️  $*" >&2; }
err(){  echo "❌ $*" >&2; }