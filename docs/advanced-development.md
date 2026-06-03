# Advanced Development Guide

This document covers the internal architecture of the tfchain_graphql indexer/processor stack. For the day-to-day workflow (adding new runtime versions, resyncing), see [typeChanges.md](./typeChanges.md).

## 1. Pre-V14 Metadata and the typesBundle

Substrate runtime metadata comes in different versions. TFChain has two eras:

- **V12 (pre-V14)**: metadata is NOT self-describing for custom types. The `typesBundle.json` file provides type definitions that tell the decoder how to interpret SCALE-encoded data.
- **V14+**: metadata is self-describing. All type information is embedded in the metadata itself. The typesBundle is not used.

The boundary differs per network:

| Network | Pre-V14 specs | First V14 spec |
|---------|--------------|----------------|
| Devnet  | 49-67        | 101            |
| QAnet   | 61-67        | 104            |
| Testnet | 9-70         | 113            |
| Mainnet | 31-70        | 113            |

The typesBundle uses `minmax` ranges to define which type definitions apply at which spec versions. For example, `[50, None]` means "from spec 50 onwards until overridden by a later entry." When a type changes (e.g., a new field is added), a new `minmax` entry is added with the updated definition.

**Event hashes** for pre-V14 specs are computed from the typesBundle type definitions combined with the metadata. This is important: the same Rust struct can produce different event hashes depending on how the typesBundle defines it (field names, field order).

## 2. The Indexer-Processor Contract

The data flow from chain to GraphQL API is:

```
Chain (SCALE-encoded events)
  -> Indexer (substrate-ingest) decodes SCALE using typesBundle -> stores decoded JSON in CockroachDB
  -> Gateway serves stored JSON
  -> Processor's decodeEvent() reads args[fieldName] from the JSON
  -> Processor stores entities in PostgreSQL
  -> Query node serves GraphQL API from PostgreSQL
```

The processor does NOT decode raw SCALE bytes. It reads pre-decoded JSON from the gateway. The `decodeEvent` method in `@subsquid/substrate-processor` iterates over the event's field definitions and reads `args[fieldName]` from the stored JSON object.

This means **field names must match** between:
- The typesBundle that the indexer used to decode and store the JSON
- The type definitions the processor expects (derived from the current typesBundle + metadata)

If the typesBundle is updated but the indexer is not resynced, the stored JSON has field names from the old typesBundle while the processor expects names from the new one. This mismatch causes assertion failures during decoding.

**Rule: always resync the indexer after changing the typesBundle.** Alternatively, add workaround patches in the mapping handlers to fix the field names before decoding (see topic 4).

## 3. Cross-Network Metadata Differences

A given spec version number typically represents the same runtime binary across all networks. This was verified by comparing metadata hex from the firesquid indexers on all 4 networks:

```graphql
# Query on each network's firesquid
{ metadata(where: {specVersion_eq: 49}) { hex } }
```

All shared pre-V14 specs have identical metadata across all networks that deployed them.

**Exceptions**: specs 125 and 134 have different WASM on devnet vs other networks. Devnet received release candidate builds that were later revised before deployment to qa/test/main. These are V14 specs, so the typesBundle is not involved. Verified that all tracked event hashes are identical despite the metadata differences (the changes are in non-event types).

The JSONL merge script (`scripts/merge-versions.js`) deduplicates by specVersion, keeping the first entry encountered. Since devnet is seeded first, devnet's metadata wins for conflicts.

## 4. The `dedicatedFarm:` Colon Bug

The typesBundle historically had a typo: `"dedicatedFarm:"` (trailing colon) in the Farm struct definition at `[63, None]`.

- **Introduced**: commit `478ee70`
- **Fixed**: commit `980dd11`
- **Grid deployment updated**: commit `119b5dc` (June 2024)
- **Indexers resynced**: never

Because the indexers were never resynced, all network indexer snapshots contain decoded JSON with `"dedicatedFarm:"` (with colon) as the field key for pre-V14 Farm events. The current typesBundle (without colon) produces a different event hash, and the processor expects `"dedicatedFarm"` (no colon) as the field name.

When the processor reads `args["dedicatedFarm"]`, it gets `undefined` because the stored key is `"dedicatedFarm:"`. The SCALE JSON codec then asserts `typeof undefined == "boolean"` and crashes.

**Workaround** (in the `isV63` branches of `farmStored` and `farmUpdated`):

```typescript
(item.event.args as any).dedicatedFarm = false
```

This adds the expected field name to the args object before decoding. The value `false` is safe because `farmStored` hardcodes `dedicatedFarm = false` anyway.

**Proper fix**: resync all indexers with the corrected typesBundle so the stored JSON has correct field names. After resync, the workaround can be removed.

**Note**: the mainnet `grid_deployment` repo still has the old typesBundle with this colon bug. Devnet, qanet, and testnet have the corrected version.

## 5. How Typegen Assigns Version Labels

Typegen reads the JSONL file in order (sorted by specVersion). For each tracked event, it:

1. Computes the event hash at each specVersion by decoding the metadata (using the typesBundle for pre-V14)
2. Compares the hash to the previous entry's hash
3. If the hash changed, generates a new `isVxx`/`asVxx` accessor named after the specVersion
4. If the hash is the same as the previous entry, skips it (consecutive hash dedup)

This means:
- The JSONL order determines which specVersion gets the "canonical" label for each hash
- The same hash can produce accessors at multiple specs if it appears, changes, then reverts (e.g., Twin hash oscillates at specs 125-127 due to devnet metadata differences)
- Typegen **cannot** handle two JSONL entries with the same specVersion (duplicate TypeScript method names would cause compilation errors)

The `isVxx` runtime check is `getEventHash(eventName) === 'hash'`. It checks the current block's runtime hash, not the spec version. So `isV9` can match blocks at any spec version as long as the event hash is the same.

## 6. Network Deployment History

| Network | Genesis spec | Genesis block | Pre-V14 range | Notes |
|---------|-------------|---------------|---------------|-------|
| Testnet | 9 | 0 | 9-70 | Oldest continuous chain. Has all historical specs. |
| Mainnet | 31 | 0 | 31-70 | Started later than testnet. |
| QAnet | 61 | 0 | 61-67 | Reset. Started from spec 61. |
| Devnet | 49 | 0 | 49-67 | Reset multiple times. Current chain starts at spec 49. Has RC specs 63-67 that are devnet-only. |

**Spec reuse after resets**: devnet was reset multiple times. Spec numbers 1-48 existed on the old devnet but are gone. The current devnet starts at spec 49. Git history may show commits with the same spec number from different eras. The deployed version is always the commit that bumps `spec_version` in `substrate-node/runtime/src/lib.rs`.

**Git commit pattern**: developers add features in commits while the runtime still has the old spec version, then a separate commit bumps the spec. The bump commit is what gets built and deployed. When tracing types at a spec version, look at the commit that set `spec_version: XX`, not earlier commits that may show intermediate states.

**Verifying deployed runtime**: compare metadata hex from firesquid indexers across networks. If the hex matches, the same WASM was deployed. If it differs, the networks have different code at that spec (typically devnet RC vs production release).

## 7. Debugging Event Decode Failures

### Symptoms

- `AssertionError: typeof value == "boolean"` (or "string", "number")
- `AssertionError: The expression evaluated to a falsy value` in codec-json.js
- Processor crash loop at a specific block

### Step 1: Identify the spec version

Enable `SQD_DEBUG=sqd:processor:mapping` on the processor (avoid `sqd:processor:*` which floods logs with serialization errors from the node-fetch URLSearchParams bug). Look for the specId in debug output or check which block the processor is stuck on:

```bash
docker logs processor-container 2>&1 | grep "last processed block"
```

Then query the indexer explorer for the spec at that block:
```graphql
{ blocks(where: {height_eq: XXXXX}) { spec { specVersion } } }
```

### Step 2: Determine pre-V14 or V14

- Devnet: spec < 101 is pre-V14
- Testnet/Mainnet: spec < 113 is pre-V14
- QAnet: spec < 104 is pre-V14

For V14 failures, the issue is in the auto-generated types. For pre-V14, the typesBundle is involved.

### Step 3: For pre-V14 failures

1. Check the typesBundle `minmax` range covering this spec
2. Verify the type definition matches the Rust source at that spec
3. **Check what the indexer stored**: query the firesquid gateway for the event:
   ```graphql
   { events(where: {name_eq: "TfgridModule.FarmStored", block: {height_eq: XXXXX}}) { args } }
   ```
4. Compare the stored field names with what the processor expects
5. If field names don't match, the indexer was built with a different typesBundle

### Step 4: Compare metadata across networks

Query each network's firesquid:

```graphql
{ metadata(where: {specVersion_eq: XX}) { hex } }
```

Compare the hex values directly. Same hex = same WASM. Different hex = different code at the same spec (typically devnet RC).

### Step 5: Compare event hashes

Save metadata to temporary JSONL files and run typegen on each to see what event hashes they produce:

```bash
# Create single-entry JSONL from indexer metadata
# Run typegen with the tracked events
# Compare the getEventHash lines in the output
```

### Step 6: Check production code

If production works but your branch doesn't:

```bash
diff <(git show origin/production-branch:src/types/events.ts | grep getEventHash | sort) \
     <(grep getEventHash src/types/events.ts | sort)
```

Look for removed hash branches or missing workaround patches in the mapping handlers.

### Common pitfalls

- **Mixed-version DB contamination**: running two different processor versions against the same PostgreSQL database creates mixed entity ID formats. Always do a full DB reset when switching versions.
- **CockroachDB snapshot extraction**: never use `--strip-components` when extracting indexer snapshots. The tar archive has SST files at root level.
- **Startup race**: on first start, the processor may fail with "relation does not exist" if migrations haven't completed. Docker restart policy recovers this automatically.
- **Shared Docker network DNS**: when both compose stacks share a network, all service names must be unique across both stacks. The indexer uses `cockroachdb` (not `db`) to avoid collision with the processor's PostgreSQL `db` service.
