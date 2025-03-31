# gk-diff-utils

A simple TypeScript/JavaScript utility for creating and applying diffs to json objects.
Support included for nested objects and arrays through recursion.

## Installation

```bash
npm i @gallagher-kaiser/diff-utils
```

## Usage

```ts
import { createDiff, applyDiff, applyDiffs, diffIterator } from '@gallagher-kaiser/diff-utils';

const revision1 = { "name": "Destiny Hope Cyrus", "Location": "Tenessee" };
const revision2 = { "name": "Destiny Hope Cyrus", "Location": "California" };
const revision3 = { "name": "Miley Cyrus", "Location": "California" };

// Create a diff
const diff1 = createDiff(revision1, revision2);
const diff2 = createDiff(revision2, revision3);

// Apply a diff to reconstruct revision2
const regenerated = applyDiff(revision3, diff2);

// Apply multiple diffs to reconstruct revision1 using revision3 as source
const regeneratedFromBatch = applyDiffs(revision3, [diff2, diff1]);

// Iterate over the properties of diff1 and print the changelog
for (const { path, key, oldValue, newValue } of diffIterator(diff1)) {
    console.log(`Modified key '${key}': ${oldValue} -> ${newValue}`);
}
```

## Scripts

• Build: `npm run build`  
• Test: `npm run test`

## License

ISC