# TFChain GraphQL

TFChain GraphQL provides a GraphQL indexing and query interface for TFChain, the ThreeFold blockchain. It uses [Subsquid](https://docs.subsquid.io) to index on-chain events and expose them through a GraphQL API.

## Concept

The substrate events are processed in a multi-step pipeline:

    Tfchain => Squid Indexer => Indexer GraphQL gateway => Squid Processor => Database => Query Node GraphQL endpoint

![Bird eye overview](https://gblobscdn.gitbook.com/assets%2F-MdI-MAyz-csivC8mmdb%2Fsync%2Fe587479ff22ad79886861487b2734b6556302d10.png?alt=media)

## Prerequisites

* Node v16x
* Docker
* Docker-compose

## Running

see [docs](./docs/readme.md)

## Project layout

- `indexer` - docker-compose setup for the indexer
- `db` - Processor db migration files
- `scripts` - Scripts for generating initial state and development scripts
- `src` - Source
    - `mappings` - Mapper functions for the indexer data
    - `model` - Generated models from the `schema.graphql` file
    - `types` - Type files that require manual edit if the schema changes / or chain types change
    - `processor.ts` - Processor entrypoint
- `typegen` - Where the declaration files are generated from (used for development)
    - `tfchainVersions.jsonl` - Generated tfchain runtime versions and their data
    - `typegen.json` - Typegen config
    - `typesBundle.json` - Typegen bundle config
- `schema.graphql` - The graphql schema file, changes to this file will results in changes to the models (`src/models`)

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.
Copyright (c) TFTech NV.