# TFChain GraphQL

[Subsquid](https://docs.subsquid.io) is used to index and provide a GraphQL interface on top of TFChain.

## Concept

The substrate events are processed in a multi-step pipeline:

    TFChain => Squid Indexer => Indexer GraphQL gateway => Squid Processor => Database => Query Node GraphQL endpoint

![Bird eye overview](https://gblobscdn.gitbook.com/assets%2F-MdI-MAyz-csivC8mmdb%2Fsync%2Fe587479ff22ad79886861487b2734b6556302d10.png?alt=media)

## Prerequisites

* Node v20+
* Docker
* Docker Compose

## Running

See [docs](./docs/readme.md)

## Project layout

- `indexer/` - Docker Compose setup for the indexer (archive)
- `db/` - Processor database migration files
- `scripts/` - Utility scripts (see [scripts/readme.md](./scripts/readme.md))
- `src/` - Processor source code
    - `mappings/` - Event handler functions that map chain events to database entities
    - `model/` - Generated TypeORM models from `schema.graphql`
    - `types/` - Auto-generated type definitions (do not edit manually — run `make typegen`)
    - `processor.ts` - Processor entrypoint: event subscription and dispatch
- `typegen/` - Type generation infrastructure
    - `tfchainVersions.jsonl` - Append-only log of runtime metadata from all TFChain networks
    - `typegen.json` - Typegen config: which events to generate types for
    - `typesBundle.json` - Frozen pre-V14 type mappings (do not edit for new runtime versions)
- `docs/` - Documentation
    - [typeChanges.md](./docs/typeChanges.md) - How to handle type changes on chain (adding new runtime versions, resync guidance)
    - [development.md](./docs/development.md) - Local development setup
    - [production.md](./docs/production.md) - Production deployment
    - [release_process.md](./docs/release_process.md) - Release workflow
- `schema.graphql` - GraphQL schema — changes here regenerate `src/model/` via `yarn codegen`
- `Makefile` - Common tasks: `typegen`, `typegen-add`, `typegen-seed`, `version-bump`
- `processor-chart/` - Helm chart for processor + query node deployment
- `indexer/chart/` - Helm chart for indexer stack deployment
