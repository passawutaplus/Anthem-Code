#!/usr/bin/env bash
# Deploy 1PX demo to Vercel (preview). Requires: vercel login, .env with Supabase keys.
set -euo pipefail
cd "$(dirname "$0")/.."

if ! command -v npx >/dev/null 2>&1; then
  echo "npx not found" >&2
  exit 1
fi

if [[ ! -f .env ]]; then
  echo "Missing .env — copy from .env.example and fill VITE_SUPABASE_*" >&2
  exit 1
fi

echo "→ Checking Vercel login…"
npx vercel whoami

if [[ ! -f .vercel/project.json ]]; then
  echo "→ Linking project (first time)…"
  npx vercel link --yes --project=1px-demo
fi

# shellcheck disable=SC1091
set -a && source .env && set +a
export VITE_DEMO_MODE=true
# ไม่บังคับ VITE_SITE_URL — ให้ OAuth ใช้ *.vercel.app อัตโนมัติบน preview

: "${VITE_SUPABASE_URL:?Set VITE_SUPABASE_URL in .env}"
: "${VITE_SUPABASE_PUBLISHABLE_KEY:?Set VITE_SUPABASE_PUBLISHABLE_KEY in .env}"

echo "→ Deploying preview (demo mode)…"
BUILD_ENVS=(
  --build-env "VITE_SUPABASE_URL=${VITE_SUPABASE_URL}"
  --build-env "VITE_SUPABASE_PUBLISHABLE_KEY=${VITE_SUPABASE_PUBLISHABLE_KEY}"
  --build-env "VITE_DEMO_MODE=true"
)
if [[ -n "${VITE_SO1O_APP_URL:-}" ]]; then
  BUILD_ENVS+=(--build-env "VITE_SO1O_APP_URL=${VITE_SO1O_APP_URL}")
fi

DEPLOY_OUTPUT="$(mktemp)"
npx vercel deploy --yes "${BUILD_ENVS[@]}" | tee "$DEPLOY_OUTPUT"
DEPLOY_URL="$(grep -Eo 'https://[a-zA-Z0-9._-]+\.vercel\.app' "$DEPLOY_OUTPUT" | tail -1)"
rm -f "$DEPLOY_OUTPUT"
[[ -n "$DEPLOY_URL" ]] || { echo "Deploy failed — no URL returned" >&2; exit 1; }

echo ""
echo "✓ Demo deployed: ${DEPLOY_URL}"
echo ""
echo "Next steps:"
echo "  1. Supabase Dashboard → Authentication → URL Configuration"
echo "     Add redirect: ${DEPLOY_URL%/}/auth/callback"
echo "  2. Share demo login: phatsawut@demo.an1hem.app / an1hem-demo-seed"
echo "  3. Production: npx vercel deploy --prod (after setting env in Vercel dashboard)"
