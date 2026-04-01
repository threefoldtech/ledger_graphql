# Processor Chart

## Install chart with Helm

Create PersistentVolumeClaims for the database if needed and reference the name in your values file in the `volume.existingpersistentVolumeClaim` property.

```sh
cd processor-chart
helm install tfchainprocessor [-f yourvaluesfile.yaml] .
```

If the processor cannot reach the database, you can set `db_url` to the db-service cluster IP:

```sh
kubectl get svc
```

Take note of the IP assigned to the db-service. Use this IP in `values.yaml` for the db URL.
