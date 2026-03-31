.PHONY: version-bump typegen typegen-seed typegen-add

# usage: > type=patch make version-bump
# usage: > type=minor make version-bump
# usage: > type=major make version-bump
version-bump:
	set -e; \
	if [ "$(type)" = "patch" ] || [ "$(type)" = "minor" ] || [ "$(type)" = "major" ]; then \
		default_branch=$$(git symbolic-ref refs/remotes/origin/HEAD | sed 's@^refs/remotes/origin/@@'); \
		git checkout $$default_branch; \
		git pull origin $$default_branch; \
		new_version=$$(npx semver -i $(type) $$(jq -r .version package.json)); \
		branch_name="$$default_branch-bump-version-to-$$new_version"; \
		git checkout -b $$branch_name; \
		jq ".version = \"$$new_version\"" package.json > temp.json && mv temp.json package.json; \
		sed -i "s/^appVersion: .*/appVersion: '$$new_version'/" indexer/chart/Chart.yaml; \
		sed -i "s/^appVersion: .*/appVersion: '$$new_version'/" processor-chart/Chart.yaml; \
		git add processor-chart/Chart.yaml indexer/chart/Chart.yaml package.json ; \
		git commit -m "Bump version to $$new_version"; \
	else \
		echo "Invalid version type. Please use patch, minor, or major."; \
	fi

# Regenerate src/types/ from accumulated specVersions in tfchainVersions.jsonl
typegen:
	npx squid-substrate-typegen typegen/typegen.json

# Discover all specVersions from all TFChain networks (mainnet, testnet, qanet, devnet)
typegen-seed:
	./scripts/seed-versions.sh

# Add new specVersion from a chain endpoint and regenerate types
# Usage: make typegen-add
# Usage: WS_URL=wss://tfchain.test.grid.tf make typegen-add
typegen-add:
	npx squid-substrate-metadata-explorer \
		--chain $${WS_URL:-ws://localhost:9944} \
		--out /tmp/new_versions.jsonl
	node scripts/merge-versions.js typegen/tfchainVersions.jsonl /tmp/new_versions.jsonl
	npx squid-substrate-typegen typegen/typegen.json
