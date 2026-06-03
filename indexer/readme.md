# Setting Up an Indexer

## Prerequisites

Both the indexer and processor compose stacks share a Docker network. Create it before starting:

```bash
docker network create tfgrid_bknd
```

## Configuration

The `.env` file contains the indexer options:

```
WS_ENDPOINT=ws://localhost:9944
START_HEIGHT=0
```

| Variable | Description |
|----------|-------------|
| `WS_ENDPOINT` | TFChain node WebSocket URL. e.g., `wss://tfchain.dev.grid.tf` or `ws://localhost:9944` |
| `START_HEIGHT` | Block height to start ingesting from. `0` = genesis (full history). Setting this higher skips earlier blocks — the processor will miss any events before this height. Only use non-zero values for testing or partial deployments. |

## Docker Compose

Start the indexer stack:

```bash
docker compose up -d
```

Stop:

```bash
docker compose down
```

### Stack Components

| Container | Image | Role |
|-----------|-------|------|
| cockroachdb | `cockroachdb/cockroach` | Database for storing raw indexed block data |
| ingest | `subsquid/substrate-ingest` | Connects to the TFChain node and ingests blocks into the database |
| gateway | `subsquid/substrate-gateway` | GraphQL gateway over ingested data — the processor queries this |
| explorer | `subsquid/substrate-explorer` | Web UI to browse raw ingested data and check sync status |

### CockroachDB Memory Tuning

By default, CockroachDB uses up to 25% of system RAM for cache and SQL memory. On VMs with limited RAM (4 GB or less), this can cause OOM. Add `--cache` and `--max-sql-memory` flags to the compose command to control usage:

```yaml
# Fixed sizes for small VMs:
command: start-single-node --insecure --cache=256MiB --max-sql-memory=256MiB

# Or fractions of total RAM for production (8+ GB):
command: start-single-node --insecure --cache=.25 --max-sql-memory=.25
```

If you see `memory budget exceeded` errors from the gateway or explorer, increase `--max-sql-memory`.

**Note on CockroachDB:** The `--insecure` flag is used for non-production/testing only. For production, use a secure cluster. See [CockroachDB docs](https://www.cockroachlabs.com/docs/stable/deploy-cockroachdb-on-premises-insecure).
