import { expect } from '@jest/globals'
import { applyDiffs } from '../src/index';

describe('applyDiffs', () => {
    it('should apply multiple diffs to an object', () => {
        const sourceObject = { a: 1, b: 2, c: 3 };
        const diffs = [
            { a: 2, d: '$DELETE' },
            { b: 3, e: 4 },
            { c: '$DELETE', f: 5 }
        ];
        const expectedResult = { a: 2, b: 3, e: 4, f: 5 };
        const result = applyDiffs(sourceObject, diffs);
        expect(result).toEqual(expectedResult);
    });

    it('should handle diffs that add and remove keys', () => {
        const sourceObject = { a: 1, b: 2 };
        const diffs = [
            { c: 3 },
            { a: '$DELETE' },
            { d: 4 },
            { c: '$DELETE' }
        ];
        const expectedResult = { b: 2, d: 4 };
        const result = applyDiffs(sourceObject, diffs);
        expect(result).toEqual(expectedResult);
    });

    it('should handle nested diffs', () => {
        const sourceObject = { a: { b: 1, c: 2 }, d: 3 };
        const diffs = [
            { a: { b: 2 } },
            { a: { c: '$DELETE' } },
            { e: 4 }
        ];
        const expectedResult = { a: { b: 2 }, d: 3, e: 4 };
        const result = applyDiffs(sourceObject, diffs);
        expect(result).toEqual(expectedResult);
    });

    it('should handle array-like objects', () => {
        const sourceObject = ['a', 'b', 'c'];
        const diffs = [
            { 0: 'x', 1: 'y' },
            { 2: '$DELETE' },
            { 2: 'z' }
        ];
        const expectedResult = ['x', 'y', 'z'];
        const result = applyDiffs(sourceObject, diffs);
        expect(result).toEqual(expectedResult);
    });
});

describe('edgeCases', () => {
    it('should handle empty diffs array', () => {
        const sourceObject = { a: 1, b: 2, c: 3 };
        const diffs: Record<string, any>[] = [];
        const expectedResult = { a: 1, b: 2, c: 3 };
        const result = applyDiffs(sourceObject, diffs);
        expect(result).toEqual(expectedResult);
    });

    it('should handle empty source object', () => {
        const sourceObject = {};
        const diffs = [
            { a: 1 },
            { b: 2 },
            { c: 3 }
        ];
        const expectedResult = { a: 1, b: 2, c: 3 };
        const result = applyDiffs(sourceObject, diffs);
        expect(result).toEqual(expectedResult);
    });

    it('should handle empty source object and diffs array', () => {
        const sourceObject = {};
        const diffs: Record<string, any>[] = [];
        const expectedResult = {};
        const result = applyDiffs(sourceObject, diffs);
        expect(result).toEqual(expectedResult);
    });
});