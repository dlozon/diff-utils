declare module '@gallagher-kaiser/diff-utils' {
  export function createDiff(oldObj: Record<string, unknown>, newObj: Record<string, unknown>): Record<string, unknown>;
  export function applyDiff(sourceObject: Record<string, unknown>, diff: Record<string, unknown>): Record<string, unknown>;
  export function applyDiffs(sourceObject: Record<string, unknown>, diffs: Record<string, unknown>[]): Record<string, unknown>;
  export function diffIterator(diff: Record<string, any>): Generator<{ key: string, oldValue: any, newValue: any }>;
}
