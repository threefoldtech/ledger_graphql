# Developing on TFChain GraphQL

## Install

```bash
npm install
npm run build
```

## Local Network

### Run TFChain

See https://github.com/threefoldtech/tfchain

### Create the shared Docker network

Both compose stacks use a shared external network. Create it once:

```bash
docker network create tfgrid_bknd
```

### Run Indexer

Check `indexer/.env` and adjust the websocket endpoint to your local TFChain address.

```bash
cd indexer
docker compose up -d
```

Indexer services should now be started. Check if it's syncing properly by streaming the ingest logs:

```bash
docker logs indexer-ingest-1 -f
```

You should see TFChain blocks being processed:

![Indexer logs](https://user-images.githubusercontent.com/73958772/209998096-3d5381d9-97ee-438d-824d-d92d997b42aa.png)

### Run Processor (local, outside Docker)

Check `.env` and adjust the settings. When running the processor locally (not in Docker) while the indexer runs in Docker, change `INDEXER_ENDPOINT_URL` to use the published port:

```bash
# .env — for local development (processor outside Docker):
INDEXER_ENDPOINT_URL=http://localhost:8888/graphql

# .env — for Docker deployment (processor inside Docker, shared network):
# INDEXER_ENDPOINT_URL=http://gateway:8000/graphql
```

Start the local PostgreSQL container and run the processor:

```bash
npm run build
npm run db:up
npm run process
```

You should see TFChain blocks being processed by the processor:

![Processor logs](https://user-images.githubusercontent.com/73958772/210000023-c575d91a-382e-4fdc-85b3-199a135b493f.png)

If you make changes, stop the containers before restarting:

```bash
docker compose down
```

### Run GraphQL UI

At this step, running `docker ps` should show the indexer containers running:

![Docker containers](https://user-images.githubusercontent.com/42457449/258668686-cd331bd6-ed80-47ea-87a5-16f88d969025.png)

Start the query node:

```bash
npm run api
```

Now you can use the GraphQL playground at http://localhost:4000/graphql

## Adding New Runtime Versions

When TFChain has a new spec version with type changes, see [typeChanges.md](./typeChanges.md) for the full workflow. The short version:

```bash
# Point at your local chain (or a remote network via WS_URL=wss://...)
make typegen-add

# Check what changed in src/types/, add handler branches if needed
npm run build
```

## Modifying the GraphQL Schema

If you need to add new entities or fields to the GraphQL API:

1. Edit `schema.graphql`
2. Regenerate models and create a migration:
   ```bash
   npm run codegen
   npm run build
   npm run db:create-migration
   ```
3. Add or update event handlers in `src/mappings/`
4. Register new events in `src/processor.ts` if needed
5. Test locally:
   ```bash
   npm run db:up
   npm run db:migrate
   npm run process
   ```

## Resetting the Processor Database

### Option A: Volume wipe (recommended)

The simplest and safest approach. Wipes the entire PostgreSQL data directory:

```bash
# Stop processor and DB
docker compose down processor db

# Wipe postgres data
rm -rf /path/to/postgres-data/*

# Restart - processor will run migrations and start from block 0
docker compose up -d
```

### Option B: Script (local dev)

```bash
./scripts/reset-db.sh
npm run process
```

## Debugging

### Debug logging

Use `SQD_DEBUG=sqd:processor:mapping` for event processing visibility. Avoid `sqd:processor:*` which floods logs with serialization errors from a known node-fetch bug.

```bash
# In .env or docker-compose.yml environment:
SQD_DEBUG=sqd:processor:mapping
```

### Check processor progress

```bash
# Current height
docker exec db-container psql -U postgres -d tfgrid-graphql \
  -c 'SELECT height FROM squid_processor.status;'

# Entity counts
docker exec db-container psql -U postgres -d tfgrid-graphql -c "
  SELECT 'farms' AS entity, count(*) FROM farm
  UNION ALL SELECT 'nodes', count(*) FROM node
  UNION ALL SELECT 'twins', count(*) FROM twin
  UNION ALL SELECT 'contracts', count(*) FROM node_contract;
"
```
