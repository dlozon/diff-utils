import { expect } from '@jest/globals';
import { applyDiff } from '../src/index';

describe('applyDiff', () => {
    it('should apply changes correctly', () => {
        const sourceObject = { a: 1, b: 2, c: 3 };
        const diff = { b: { newValue: 2, oldValue: 4 }};
        const expectedResult = { a: 1, b: 4, c: 3 };
        expect(applyDiff(sourceObject, diff)).toEqual(expectedResult);
    });

    it('should handle adding new keys', () => {
        const sourceObject = { a: 1, b: 2 };
        const diff = { c: { newValue: null, oldValue: 3 }};
        const expectedResult = { a: 1, b: 2, c: 3 };
        expect(applyDiff(sourceObject, diff)).toEqual(expectedResult);
    });

    it('should handle deleting keys', () => {
        const sourceObject = { a: 1, b: 2, c: 3 };
        const diff = { b: { newValue: 2, oldValue: null }};
        const expectedResult = { a: 1, c: 3 };
        expect(applyDiff(sourceObject, diff)).toEqual(expectedResult);
    });
});

describe('applyNestedDiffs', () => {
    it('should apply nested changes correctly', () => {
        const sourceObject = { a: 1, b: { x: 10, y: 20, z: 30 }, c: 3 };
        const diff = { b: { y: { newValue: 20, oldValue: 40 }}};
        const expectedResult = { a: 1, b: { x:10, y: 40, z: 30 }, c: 3 };
        expect(applyDiff(sourceObject, diff)).toEqual(expectedResult);
    });

    it('should handle nested key additions', () => {
        const sourceObject = { a: 1, b: { x: 10, y: 20 }, c: 3 };
        const diff = { b: { z: { newValue: null, oldValue: 30 }}};
        const expectedResult = { a: 1, b: { x: 10, y: 20, z: 30 }, c: 3 };
        expect(applyDiff(sourceObject, diff)).toEqual(expectedResult);
    });

    it('should handle nested key deletions', () => {
        const sourceObject = { a: 1, b: { x: 10, y: 20, z: 30 }, c: 3 };
        const diff = { b: { y: { newValue: 20, oldValue: null }}};
        const expectedResult = { a: 1, b: { x: 10, z: 30 }, c: 3 };
        expect(applyDiff(sourceObject, diff)).toEqual(expectedResult);
    });
});

describe('applyArrayDiffs', () => {
    it('should handle changing array-like objects', () => {
        const sourceObject = ['x', 'y', 'z'];
        const diff = { 1: { newValue: 'y', oldValue: 'w' }};
        const expectedResult = ['x', 'w', 'z'];
        expect(applyDiff(sourceObject, diff)).toEqual(expectedResult);
    });

    it('should handle changing nested array-like objects', () => {
        const sourceObject = { a: 1, b: ['x', 'y', 'z'], c: 3 };
        const diff = { b: { 1: { newValue: 'y', oldValue: 'w' }}};
        const expectedResult = { a: 1, b: ['x', 'w', 'z'], c: 3 };
        expect(applyDiff(sourceObject, diff)).toEqual(expectedResult);
    });
    
    it('should handle adding array-like objects', () => {
        const sourceObject = { a: 1, b: 2 };
        const diff = { c: { newValue: null, oldValue: ['x', 'y', 'z'] }};
        const expectedResult = {a: 1, b: 2, c: ['x', 'y', 'z'] };
        expect(applyDiff(sourceObject, diff)).toEqual(expectedResult);
    });

    it('should handle adding to array-like objects', () => {
        const sourceObject = { a: 1, b: 2, c: ['x', 'y'] };
        const diff = { c: { 2: { newValue: null, oldValue: 'z' }}};
        const expectedResult = { a: 1, b: 2, c: ['x', 'y', 'z'] };
        expect(applyDiff(sourceObject, diff)).toEqual(expectedResult);
    });

    it('should handle deleting array-like objects', () => {
        const sourceObject = { a: 1, b: 2, c: ['x', 'y', 'z'] };
        const diff = { c: { newValue: ['x', 'y', 'z'], oldValue: null }};
        const expectedResult = { a: 1, b: 2 };
        expect(applyDiff(sourceObject, diff)).toEqual(expectedResult);
    });

    it('should handle deleting from array-like objects', () => {
        const sourceObject = { a: 1, b: 2, c: ['x', 'y', 'z'] };
        const diff = { c: { 2: { newValue: 'z', oldValue: null }}};
        const expectedResult = { a: 1, b: 2, c: ['x', 'y'] };
        expect(applyDiff(sourceObject, diff)).toEqual(expectedResult);
    });
});

describe('applicationEdgeCases', () => {
    it('should handle empty diffs correctly', () => {
        const sourceObject = { a: 1, b: 2 };
        const diff = {};
        expect(applyDiff(sourceObject, diff)).toEqual(sourceObject);
    });
});