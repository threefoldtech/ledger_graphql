# TFChain GraphQL

A high-performance indexing layer with a queryable GraphQL API over TFChain on-chain data. It enables efficient data access for dashboards, applications, and analytics tools without directly querying the blockchain.

## What this is

This project provides a Subsquid-based indexer that consumes raw blockchain events from TFChain, transforms them into a structured schema, and exposes them through a GraphQL endpoint. It replaces direct chain queries with a fast, developer-friendly API suitable for front-end applications and data analytics.

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
TFChain => Squid Indexer => Indexer GraphQL gateway => Squid Processor => Database => Query Node GraphQL endpoint
```

## Relation to ThreeFold

This technology is used within the ThreeFold ecosystem and was first deployed on the ThreeFold Grid. The component itself is designed as reusable infrastructure technology and should be understood by its technical function first, independent of any specific deployment.

## Ownership

This repository is owned and maintained by TF-Tech NV, a Belgian company responsible for the development and maintenance of this technology.

## Prerequisites

- Node v16.x
- Docker
- Docker Compose

## Running

See [docs](./docs/readme.md) for detailed running instructions.

## Project layout

- `indexer` — Docker Compose setup for the indexer
- `db` — Processor database migration files
- `scripts` — Scripts for generating initial state and development scripts
- `src` — Source code
  - `mappings` — Mapper functions for indexer data
  - `model` — Generated models from the `schema.graphql` file
  - `types` — Type files that require manual edits when the schema or chain types change
  - `processor.ts` — Processor entrypoint
- `typegen` — Declaration file generation (used for development)
  - `tfchainVersions.jsonl` — Generated TFChain runtime versions and their data
  - `typegen.json` — Typegen config
  - `typesBundle.json` — Typegen bundle config
- `schema.graphql` — The GraphQL schema file; changes to this file result in changes to the models in `src/models`

## License

This project is licensed under the Apache License 2.0 — see the [LICENSE](LICENSE) file for details.
Copyright (c) TFTech NV.
