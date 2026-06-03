# Release Process

## Automated Version Bump

The Makefile automates version bumping across `package.json` and both Helm charts:

```bash
make version-bump type=patch   # 2.12.3 → 2.12.4
make version-bump type=minor   # 2.12.3 → 2.13.0
make version-bump type=major   # 2.12.3 → 3.0.0
```

This will:
1. Checkout the default branch and pull latest
2. Create a new branch `{default-branch}-bump-version-to-{version}`
3. Update versions in `package.json`, `indexer/chart/Chart.yaml`, and `processor-chart/Chart.yaml`
4. Commit the changes

Then create a PR, get it merged, and tag the release.

## Manual Version Bump

If you prefer to do it manually:

1. Update the version in `package.json`
2. Update `appVersion` in `indexer/chart/Chart.yaml` and `processor-chart/Chart.yaml`
3. Commit and tag the commit with the new version (e.g., `v2.13.0`)

## Creating a Release

1. Create a release on the GitHub releases page from the tag
2. The release title should be the version number
3. The release description should contain the changelog
4. The `publish_container_images.yml` workflow will automatically build and push container images on tagged releases
