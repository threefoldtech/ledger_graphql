# Setting Up an Indexer

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

```
docker compose up -d
```

Stop:

```
docker compose down
```

### Stack Components

| Container | Image | Role |
|-----------|-------|------|
| db | `cockroachdb/cockroach` | Database for storing raw indexed block data |
| ingest | `subsquid/substrate-ingest` | Connects to the TFChain node and ingests blocks into the database |
| gateway | `subsquid/substrate-gateway` | GraphQL gateway over ingested data — the processor queries this |
| explorer | `subsquid/substrate-explorer` | Web UI to browse raw ingested data and check sync status |

**Note on CockroachDB:** The `--insecure` flag is used for non-production/testing only. For production, use a secure cluster. See [CockroachDB docs](https://www.cockroachlabs.com/docs/stable/deploy-cockroachdb-on-premises-insecure).
