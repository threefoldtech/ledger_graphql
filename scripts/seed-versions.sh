#!/bin/bash
set -euo pipefail

# seed-versions.sh — Discover all specVersions from TFChain networks
#
# Runs squid-substrate-metadata-explorer against each network and merges
# discovered specVersions into the master tfchainVersions.jsonl file.
#
# Usage:
#   ./scripts/seed-versions.sh                    # All networks
#   ./scripts/seed-versions.sh mainnet testnet    # Specific networks only
#
# Requires: npx (with @subsquid/substrate-metadata-explorer installed), node

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
MASTER="$REPO_DIR/typegen/tfchainVersions.jsonl"
TYPES_BUNDLE="$REPO_DIR/typegen/typesBundle.json"
TMP_DIR=$(mktemp -d)

# Network endpoints
declare -A NETWORKS=(
    [mainnet]="wss://tfchain.grid.tf"
    [testnet]="wss://tfchain.test.grid.tf"
    [qanet]="wss://tfchain.qa.grid.tf"
    [devnet]="wss://tfchain.dev.grid.tf"
)

# Default order: devnet first (follows deployment pipeline: devnet → qanet → testnet → mainnet)
# This ensures typegen picks the earliest specVersion where each hash first appeared.
DEFAULT_ORDER="devnet qanet testnet mainnet"

cleanup() {
    rm -rf "$TMP_DIR"
}
trap cleanup EXIT

if [ ! -f "$TYPES_BUNDLE" ]; then
    echo "Error: typesBundle.json not found at $TYPES_BUNDLE"
    echo "Restore it from indexer/typesBundle.json first."
    exit 1
fi

# Determine which networks to scan
if [ $# -gt 0 ]; then
    SCAN_NETWORKS="$*"
else
    SCAN_NETWORKS="$DEFAULT_ORDER"
fi

# Initialize master file if it doesn't exist
if [ ! -f "$MASTER" ]; then
    touch "$MASTER"
    echo "Created empty master file: $MASTER"
fi

echo "=== TFChain specVersion Discovery ==="
echo "Master file: $MASTER"
echo ""

TOTAL_ADDED=0

for network in $SCAN_NETWORKS; do
    endpoint="${NETWORKS[$network]:-}"
    if [ -z "$endpoint" ]; then
        echo "Warning: unknown network '$network', skipping"
        continue
    fi

    outfile="$TMP_DIR/tfchain_${network}.jsonl"
    echo "--- $network ($endpoint) ---"

    if npx squid-substrate-metadata-explorer \
        --chain "$endpoint" \
        --typesBundle "$TYPES_BUNDLE" \
        --out "$outfile" 2>&1; then

        if [ -f "$outfile" ] && [ -s "$outfile" ]; then
            count_before=$(wc -l < "$MASTER" 2>/dev/null || echo 0)
            node "$SCRIPT_DIR/merge-versions.js" "$MASTER" "$outfile"
            count_after=$(wc -l < "$MASTER")
            added=$((count_after - count_before))
            TOTAL_ADDED=$((TOTAL_ADDED + added))
        else
            echo "  Warning: explorer produced empty output for $network"
        fi
    else
        echo "  Warning: failed to connect to $network ($endpoint), skipping"
    fi
    echo ""
done

echo "=== Done ==="
TOTAL=$(wc -l < "$MASTER" 2>/dev/null || echo 0)
echo "Total specVersions in master: $TOTAL"
echo "New specVersions added this run: $TOTAL_ADDED"
