# Production Setup

## Requirements

- TFChain network WebSocket URL (e.g., `wss://tfchain.dev.grid.tf/ws`)
- Docker
- Docker Compose

## Architecture

The production stack has two independent layers:

1. **Indexer (archive)** — ingests raw blocks from a TFChain node into CockroachDB. Provides a GraphQL gateway for the processor to query block data.
2. **Processor + Query Node** — reads events from the indexer, maps them to domain entities (nodes, farms, contracts, etc.), stores in PostgreSQL, and serves the public GraphQL API.

## Run the Setup

### 1. Indexer

Configure `indexer/.env`:

| Variable | Description | Default |
|----------|-------------|---------|
| `WS_ENDPOINT` | TFChain node WebSocket URL | `ws://localhost:9944` |
| `START_HEIGHT` | Block height to start ingesting from. `0` = genesis (full history). Set higher only for testing or partial deployments — the processor will miss events before this height. | `0` |

```bash
cd indexer
docker compose up -d
```

See [indexer/readme.md](../indexer/readme.md) for details on the indexer stack containers.

### 2. Processor + Query Node

Configure `.env` in the project root:

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_NAME` | PostgreSQL database name | `tfgrid-graphql` |
| `DB_USER` | PostgreSQL user | `postgres` |
| `DB_PASS` | PostgreSQL password | `postgres` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `INDEXER_ENDPOINT_URL` | Indexer GraphQL gateway URL | `http://localhost:8888/graphql` |
| `WS_URL` | TFChain node WebSocket URL (used for RPC calls) | `ws://localhost:9944` |
| `TYPEORM_LOGGING` | TypeORM log level | `error` |

```bash
docker compose up -d
```

The GraphQL endpoint is now available at `http://localhost:4000/graphql`

## Reprocessing

If a mapping bug is fixed and data needs remapping, reset the processor database and reindex:

```bash
docker compose down processor query-node
./scripts/reset-db.sh
docker compose up -d
```

This drops and recreates the processor's PostgreSQL database and reindexes from block 0 against the existing indexer data. The indexer does not need to be restarted — it stores raw blocks independently.

See [typeChanges.md](./typeChanges.md) for more detail on when a resync is needed.
