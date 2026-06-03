# Indexer Stack Chart

## Install chart with Helm

Create PersistentVolumeClaims for the database if needed and reference the name in your values file in the `volume.existingpersistentVolumeClaim` property.

```sh
helm install tfchainindexer [-f yourvaluesfile.yaml] .
```

If the indexer cannot reach the database, you can set `db_url` to the db-service cluster IP:

```sh
kubectl get svc
```

Take note of the IP assigned to the db-service. Use this IP in `values.yaml` for `db_endpoint`, `ws_endpoint`, and `indexer_status_service_url`. You can update these via `helm upgrade` if the IPs change.
