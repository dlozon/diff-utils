import { expect } from '@jest/globals';
import { createDiff } from '../src/index';

describe('createDiff', () => {
    it('should handle changed values', () => {
        const oldObj = { a: 1, b: 2 };
        const newObj = { a: 1, b: 3 };
        const diff = createDiff(oldObj, newObj);
        expect(diff).toEqual({ b: 2 });
    });

    it('should handle added keys', () => {
        const oldObj = { a: 1 };
        const newObj = { a: 1, b: 2 };
        const diff = createDiff(oldObj, newObj);
        expect(diff).toEqual({ b: '$DELETE' });
    });

    it('should handle removed keys', () => {
        const oldObj = { a: 1, b: 2 };
        const newObj = { a: 1 };
        const diff = createDiff(oldObj, newObj);
        expect(diff).toEqual({ b: 2 });
    });
});

describe('createNestedDiffs', () => {
    it('should handle changing nested objects', () => {
        const oldObj = { a: 1, b: { c: 2, d: 3 } };
        const newObj = { a: 1, b: { c: 2, d: 4 } };
        const diff = createDiff(oldObj, newObj);
        expect(diff).toEqual({ b: { d: 3 } });
    });

    it('should handle adding nested objects', () => {
        const oldObj = { a: 1, b: 2 };
        const newObj = { a: 1, b: 2, c: { d: 3 } };
        const diff = createDiff(oldObj, newObj);
        expect(diff).toEqual({ c: '$DELETE' });
    });

    it('should handle nested objects with added keys', () => {
        const oldObj = { a: 1, b: { c: 2 } };
        const newObj = { a: 1, b: { c: 2, d: 3 } };
        const diff = createDiff(oldObj, newObj);
        expect(diff).toEqual({ b: { d: '$DELETE' } });
    });

    it('should handle removing nested objects', () => {
        const oldObj = { a: 1, b: 2, c: { d: 3 } };
        const newObj = { a: 1, b: 2 };
        const diff = createDiff(oldObj, newObj);
        expect(diff).toEqual({ c: { d: 3 } });
    });

    it('should handle nested objects with removed keys', () => {
        const oldObj = { a: 1, b: { c: 2, d: 3 } };
        const newObj = { a: 1, b: { c: 2 } };
        const diff = createDiff(oldObj, newObj);
        expect(diff).toEqual({ b: { d: 3 } });
    });
});

describe('createArrayDiffs', () => {
    it('should handle modifying array-like objects', () => {
        const oldObj = ['a', 'b', 'c'];
        const newObj = ['a', 'd', 'c'];
        const diff = createDiff(oldObj, newObj);
        expect(diff).toEqual({ 1: 'b' });
    });

    it('should handle creating array-like objects', () => {
        const oldObj = { a: 1, b: 2 };
        const newObj = {a: 1, b: 2, c: ['a', 'b', 'c']};
        const diff = createDiff(oldObj, newObj);
        expect(diff).toEqual({ c: '$DELETE' });
    });

    it('should handle adding to array-like objects', () => {
        const oldObj = ['a', 'b', 'c'];
        const newObj = ['a', 'b', 'c', 'd'];
        const diff = createDiff(oldObj, newObj);
        expect(diff).toEqual({ 3: '$DELETE' });
    });

    it('should handle removing array-like objects', () => {
        const oldObj = {a: 1, b: 2, c: ['a', 'b', 'c']};
        const newObj = { a: 1, b: 2 }
        const diff = createDiff(oldObj, newObj);
        expect(diff).toEqual({ c: ['a', 'b', 'c'] });
    });

    it('should handle removing from array-like objects', () => {
        const oldObj = ['a', 'b', 'c'];
        const newObj = ['a', 'c'];
        const diff = createDiff(oldObj, newObj);
        expect(diff).toEqual({ 1: 'b', 2: 'c' });
    });
});

describe('creationEdgeCases', () => {
    it('should return an empty diff for identical objects', () => {
        const oldObj = { a: 1, b: 2 };
        const newObj = { a: 1, b: 2 };
        const diff = createDiff(oldObj, newObj);
        expect(diff).toEqual({});
    });

    it('should handle empty objects', () => {
        const oldObj = {};
        const newObj = {};
        const diff = createDiff(oldObj, newObj);
        expect(diff).toEqual({});
    });

    it('should handle empty arrays', () => {
        const oldObj: unknown[] = [];
        const newObj: unknown[] = [];
        const diff = createDiff(oldObj, newObj);
        expect(diff).toEqual({});
    });
});