# Scripts

## Processor Scripts

| Script | Description |
|--------|-------------|
| `init-countries.js` | Initialize countries/cities collection from open APIs. Runs automatically on every processor start (via `yarn process`). |
| `reset-db.sh` | Drop and recreate the processor database. Use this to reindex from scratch after mapping changes. |
| `restart.sh` | Restart the processor. |
| `init-db.sh` | Initialize database setup. |

## Type Generation Scripts

| Script | Description |
|--------|-------------|
| `seed-versions.sh` | Discover all specVersions from all TFChain networks (devnet, qanet, testnet, mainnet) and populate `typegen/tfchainVersions.jsonl`. Used for initial seeding or recovery. |
| `merge-versions.js` | Append-only merger for JSONL files. Merges new specVersions into the existing version log, sorted by specVersion. Used by `make typegen-add`. |

## Data Files

| File | Description |
|------|-------------|
| `countries.json` | Static country/city data used by `init-countries.js`. |
