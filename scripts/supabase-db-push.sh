#!/usr/bin/env bash
# Push local migrations to remote Supabase (project in supabase/config.toml).
# Requires one of:
#   - supabase login (stores token)
#   - SUPABASE_ACCESS_TOKEN in env or scripts/ecosystem/.env.seed.local
#   - SUPABASE_DB_PASSWORD for --password flag
set -euo pipefail
cd "$(dirname "$0")/.."

ENV_FILE="scripts/ecosystem/.env.seed.local"
if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

CLI=(npx supabase)

if [[ -n "${SUPABASE_ACCESS_TOKEN:-}" ]]; then
  export SUPABASE_ACCESS_TOKEN
  echo "Using SUPABASE_ACCESS_TOKEN from environment."
fi

PROJECT_REF="${SUPABASE_PROJECT_REF:-rvnzjiskqliexysicfmh}"

if ! "${CLI[@]}" projects list &>/dev/null; then
  echo "Not logged in. Run one of:"
  echo "  npx supabase login"
  echo "  export SUPABASE_ACCESS_TOKEN=sbp_...   # https://supabase.com/dashboard/account/tokens"
  exit 1
fi

if [[ ! -f supabase/.temp/project-ref ]]; then
  echo "Linking project ${PROJECT_REF}..."
  "${CLI[@]}" link --project-ref "$PROJECT_REF" --yes
fi

ARGS=(db push --linked --include-all --yes)
if [[ -n "${SUPABASE_DB_PASSWORD:-}" ]]; then
  ARGS+=(--password "$SUPABASE_DB_PASSWORD")
fi

echo "Running: supabase ${ARGS[*]}"
"${CLI[@]}" "${ARGS[@]}"
