# Ledger GraphQL

A high-performance indexing layer with a queryable GraphQL API over Ledger Chain on-chain data. It enables efficient data access for dashboards, applications, and analytics tools without directly querying the blockchain.

## What this is

This project provides a [Subsquid](https://docs.subsquid.io)-based indexer that consumes raw blockchain events from Ledger Chain, transforms them into a structured schema, and exposes them through a GraphQL endpoint. It replaces direct chain queries with a fast, developer-friendly API suitable for front-end applications and data analytics.

## What this repository contains

- **Indexer** — Docker Compose setup for the Squid indexer that ingests on-chain events
- **Processor** — Event processing pipeline that maps raw chain data to database models
- **GraphQL schema** — `schema.graphql` defining the queryable data model
- **Database migrations** — Migration files for the processor database
- **Type definitions** — Chain-specific type files for decoding events
- **Mapping functions** — Logic for transforming events into indexed entities
- **Scripts** — Utility scripts for generating initial state and development workflows

## Role in the stack

The indexer sits between the blockchain and consumer applications. It decouples data access from the chain, allowing complex queries, aggregations, and historical lookups that would be inefficient or impossible via direct RPC calls. Dashboards, explorers, and third-party integrations rely on this layer for real-time and historical data.

The data pipeline is:

```
Ledger Chain => Squid Indexer => Indexer GraphQL gateway => Squid Processor => Database => Query Node GraphQL endpoint
```

## Relation to ThreeFold

This technology is used within the ThreeFold ecosystem and was first deployed on the ThreeFold Grid. The component itself is designed as reusable infrastructure technology and should be understood by its technical function first, independent of any specific deployment.

## Ownership

This repository is owned and maintained by TF-Tech NV, a Belgian company responsible for the development and maintenance of this technology.

## Prerequisites

- Node v20+
- Docker
- Docker Compose

## Running

See [docs](./docs/readme.md) for detailed running instructions.

## Project layout

- `indexer/` — Docker Compose setup for the indexer (archive)
- `db/` — Processor database migration files
- `scripts/` — Utility scripts (see [scripts/readme.md](./scripts/readme.md))
- `src/` — Processor source code
    - `mappings/` — Event handler functions that map chain events to database entities
    - `model/` — Generated TypeORM models from `schema.graphql`
    - `types/` — Auto-generated type definitions (do not edit manually — run `make typegen`)
    - `processor.ts` — Processor entrypoint: event subscription and dispatch
- `typegen/` — Type generation infrastructure
    - `tfchainVersions.jsonl` — Append-only log of runtime metadata from all Ledger Chain networks
    - `typegen.json` — Typegen config: which events to generate types for
    - `typesBundle.json` — Frozen pre-V14 type mappings (do not edit for new runtime versions)
- `docs/` — Documentation
    - [typeChanges.md](./docs/typeChanges.md) — How to handle type changes on chain (adding new runtime versions, resync guidance)
    - [development.md](./docs/development.md) — Local development setup
    - [production.md](./docs/production.md) — Production deployment
    - [release_process.md](./docs/release_process.md) — Release workflow
- `schema.graphql` — GraphQL schema — changes here regenerate `src/model/` via `npm run codegen`
- `Makefile` — Common tasks: `typegen`, `typegen-add`, `typegen-seed`, `version-bump`
- `processor-chart/` — Helm chart for processor + query node deployment
- `indexer/chart/` — Helm chart for indexer stack deployment

## License

This project is licensed under the Apache License 2.0 — see the [LICENSE](LICENSE) file for details.
