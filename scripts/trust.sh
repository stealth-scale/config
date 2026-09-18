#!/usr/bin/env bash
# Publishes every package that is not on the registry yet, then trusts the release workflow of
# this repository to publish it from GitHub Actions.
#
# The publish runs through pnpm in the package directory, which resolves the workspace ranges
# and asks for the one-time password where the account requires one. The trust runs through npm,
# which needs the package on the registry, a login with two-factor authentication and npm 11.15
# or later. npm refuses to run inside this workspace because the root manifest names pnpm under
# devEngines, so the trust pass runs from a scratch directory outside it.
#
# Usage: scripts/trust.sh [--dry-run]

set -euo pipefail

REPO="stealth-scale/config"
FILE="release.yml"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SCRATCH="$(mktemp -d)"
DRY_RUN="${1:-}"

trap 'rm -rf "$SCRATCH"' EXIT

# Runs a command, or prints it under --dry-run.
run() {
  if [[ "$DRY_RUN" == "--dry-run" ]]; then
    echo "  would run: $*"
  else
    "$@"
  fi
}

cd "$ROOT"

if ! pnpm whoami >/dev/null 2>&1; then
  echo "not logged in to the registry: run npm login first" >&2
  exit 1
fi

names=()

for manifest in packages/*/package.json foundations/*/package.json; do
  if [[ "$(jq -r '.private // false' "$manifest")" == "true" ]]; then
    continue
  fi

  dir="$(dirname "$manifest")"
  name="$(jq -r '.name' "$manifest")"
  names+=("$name")
  echo "$name"

  if pnpm view "$name" name >/dev/null 2>&1; then
    echo "  on the registry"
  else
    (cd "$dir" && run pnpm run build && run pnpm publish --access public --no-git-checks)
  fi
done

pushd "$SCRATCH" >/dev/null

for name in "${names[@]}"; do
  echo "$name"
  trusted="$(npm trust list "$name" 2>/dev/null || true)"

  if grep -q "$REPO" <<<"$trusted" && grep -q "$FILE" <<<"$trusted"; then
    echo "  trusts $REPO $FILE"
  else
    run npm trust github "$name" --file "$FILE" --repo "$REPO" --allow-publish --yes
  fi
done

popd >/dev/null
