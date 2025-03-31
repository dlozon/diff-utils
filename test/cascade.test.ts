import { expect } from '@jest/globals'
import { applyDiffs } from '../src/index';

describe('applyDiffs', () => {
    it('should apply multiple diffs to an object', () => {
        const sourceObject = { a: 1, b: 2, c: 3 };
        const diffs = [
            { a: { newValue: 1, oldValue: 2 }, b: { newValue: 2, oldValue: 6 }},
            { b: { newValue: 6, oldValue: 3 }, e: { newValue: null, oldValue: 4 }},
            { c: { newValue: 3, oldValue: null }, f: { newValue: null, oldValue: 5 }}
        ];
        const expectedResult = { a: 2, b: 3, e: 4, f: 5 };
        const result = applyDiffs(sourceObject, diffs);
        expect(result).toEqual(expectedResult);
    });

    it('should handle diffs that add and remove keys', () => {
        const sourceObject = { a: 1, b: 2 };
        const diffs = [
            { c: { newValue: null, oldValue: 5 } },
            { a: { newValue: 1, oldValue: null } },
            { d: { newValue: null, oldValue: 4 } },
            { c: { newValue: 5, oldValue: null } }
        ];
        const expectedResult = { b: 2, d: 4 };
        const result = applyDiffs(sourceObject, diffs);
        expect(result).toEqual(expectedResult);
    });

    it('should handle nested diffs', () => {
        const sourceObject = { a: { b: 1, c: 2 }, d: 3 };
        const diffs = [
            { a: { b: { newValue: 1, oldValue: 2 }}},
            { a: { c: { newValue: 2, oldValue: null }}},
            { e: { newValue: null, oldValue: 4 }}
        ];
        const expectedResult = { a: { b: 2 }, d: 3, e: 4 };
        const result = applyDiffs(sourceObject, diffs);
        expect(result).toEqual(expectedResult);
    });

    it('should handle array-like objects', () => {
        const sourceObject = ['a', 'b', 'c'];
        const diffs = [
            { 0: { newValue: 'a', oldValue: 'x' }, 1: { newValue: 'b', oldValue: 'y' }},
            { 2: { newValue: 'c', oldValue: null } },
            { 2: { newValue: null, oldValue: 'z' } }
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
            { a: { newValue: null, oldValue: 1 }},
            { b: { newValue: null, oldValue: 2 }},
            { c: { newValue: null, oldValue: 3 }}
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