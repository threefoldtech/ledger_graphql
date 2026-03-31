#!/usr/bin/env node

/**
 * merge-versions.js — Append-only merger for tfchainVersions.jsonl
 *
 * Usage: node scripts/merge-versions.js <master.jsonl> <new.jsonl>
 *
 * Reads both JSONL files, indexes entries by specVersion, and appends
 * any new specVersions from <new.jsonl> into <master.jsonl>.
 * Existing entries are never modified or removed.
 *
 * Exit codes:
 *   0 — success (entries added or nothing to add)
 *   1 — usage error or file not found
 */

const fs = require('fs');
const path = require('path');

function parseJsonl(filePath) {
    if (!fs.existsSync(filePath)) {
        return [];
    }
    const content = fs.readFileSync(filePath, 'utf8').trim();
    if (!content) return [];
    return content.split('\n').map((line, i) => {
        try {
            return JSON.parse(line);
        } catch (e) {
            console.error(`Warning: skipping malformed JSON at ${filePath}:${i + 1}`);
            return null;
        }
    }).filter(Boolean);
}

function getSpecVersion(entry) {
    // The JSONL format may have specVersion at top level or nested
    return entry.specVersion ?? entry.spec_version ?? entry.specName;
}

function main() {
    const args = process.argv.slice(2);
    if (args.length < 2) {
        console.error('Usage: node scripts/merge-versions.js <master.jsonl> <new.jsonl>');
        process.exit(1);
    }

    const [masterPath, newPath] = args;

    if (!fs.existsSync(newPath)) {
        console.error(`Error: new versions file not found: ${newPath}`);
        process.exit(1);
    }

    const existing = parseJsonl(masterPath);
    const incoming = parseJsonl(newPath);

    const seen = new Set(existing.map(e => getSpecVersion(e)));

    const added = [];
    for (const entry of incoming) {
        const version = getSpecVersion(entry);
        if (version != null && !seen.has(version)) {
            seen.add(version);
            added.push(entry);
        }
    }

    if (added.length === 0) {
        console.log('No new specVersions found.');
        return;
    }

    // Merge and write sorted by specVersion
    const all = [...existing, ...added].sort((a, b) => getSpecVersion(a) - getSpecVersion(b));
    const output = all.map(e => JSON.stringify(e)).join('\n') + '\n';
    fs.writeFileSync(masterPath, output);

    const versions = added.map(e => getSpecVersion(e)).sort((a, b) => a - b);
    console.log(`Added ${added.length} new specVersion(s): ${versions.join(', ')}`);
    console.log(`Master file now has ${all.length} total specVersion(s), sorted by specVersion.`);
}

main();
