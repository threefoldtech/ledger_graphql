# Indexer Development

## typesBundle.json

The `typesBundle.json` file maps Substrate custom types for pre-V14 metadata (specVersions before ~v100). This file is **frozen** — TFChain now uses Polkadot SDK v1.1.0 with V14+ self-describing metadata, so new runtime versions do not require changes to this file.

See [docs/typeChanges.md](../docs/typeChanges.md#notes-on-typesbundlejson) for details.

## Updating the Helm Chart ConfigMap

If `typesBundle.json` ever needs updating (unlikely — only for newly discovered pre-V14 type gaps), regenerate the Helm chart configmap:

```sh
kubectl create configmap indexer-config --from-file=./typesBundle.json --dry-run=client --output=yaml > chart/templates/indexer-config.yaml
```

Then update the chart version in `chart/Chart.yaml`.
