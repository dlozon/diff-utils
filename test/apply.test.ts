import { expect } from '@jest/globals';
import { applyDiff } from '../src/index';

describe('applyDiff', () => {
    it('should apply changes correctly', () => {
        const sourceObject = { a: 1, b: 2, c: 3 };
        const diff = { b: 4 };
        const expectedResult = { a: 1, b: 4, c: 3 };
        expect(applyDiff(sourceObject, diff)).toEqual(expectedResult);
    });

    it('should handle adding new keys', () => {
        const sourceObject = { a: 1, b: 2 };
        const diff = { c: 3 };
        const expectedResult = { a: 1, b: 2, c: 3 };
        expect(applyDiff(sourceObject, diff)).toEqual(expectedResult);
    });

    it('should handle deleting keys', () => {
        const sourceObject = { a: 1, b: 2, c: 3 };
        const diff = { b: '$DELETE' };
        const expectedResult = { a: 1, c: 3 };
        expect(applyDiff(sourceObject, diff)).toEqual(expectedResult);
    });
});

describe('applyNestedDiffs', () => {
    it('should apply nested changes correctly', () => {
        const sourceObject = { a: 1, b: { x: 10, y: 20, z: 30 }, c: 3 };
        const diff = { b: { y: 40 }, c: 3 };
        const expectedResult = { a: 1, b: { x:10, y: 40, z: 30 }, c: 3 };
        expect(applyDiff(sourceObject, diff)).toEqual(expectedResult);
    });

    it('should handle nested key additions', () => {
        const sourceObject = { a: 1, b: { x: 10, y: 20 }, c: 3 };
        const diff = { b: { z: 30 } };
        const expectedResult = { a: 1, b: { x: 10, y: 20, z: 30 }, c: 3 };
        expect(applyDiff(sourceObject, diff)).toEqual(expectedResult);
    });

    it('should handle nested key deletions', () => {
        const sourceObject = { a: 1, b: { x: 10, y: 20, z: 30 }, c: 3 };
        const diff = { b: { y: '$DELETE' } };
        const expectedResult = { a: 1, b: { x: 10, z: 30 }, c: 3 };
        expect(applyDiff(sourceObject, diff)).toEqual(expectedResult);
    });
});

describe('applyArrayDiffs', () => {
    it('should handle changing array-like objects', () => {
        const sourceObject = ['x', 'y', 'z'];
        const diff = { 1: 'w' };
        const expectedResult = ['x', 'w', 'z'];
        expect(applyDiff(sourceObject, diff)).toEqual(expectedResult);
    });

    it('should handle changing nested array-like objects', () => {
        const sourceObject = { a: 1, b: ['x', 'y', 'z'], c: 3 };
        const diff = { b: { 1: 'w' } };
        const expectedResult = { a: 1, b: ['x', 'w', 'z'], c: 3 };
        expect(applyDiff(sourceObject, diff)).toEqual(expectedResult);
    });
    
    it('should handle adding array-like objects', () => {
        const sourceObject = { a: 1, b: 2 };
        const diff = { c: ['x', 'y', 'z'] };
        const expectedResult = {a: 1, b: 2, c: ['x', 'y', 'z'] };
        expect(applyDiff(sourceObject, diff)).toEqual(expectedResult);
    });

    it('should handle adding to array-like objects', () => {
        const sourceObject = { a: 1, b: 2, c: ['x', 'y'] };
        const diff = { c: { 2: 'z' } };
        const expectedResult = { a: 1, b: 2, c: ['x', 'y', 'z'] };
        expect(applyDiff(sourceObject, diff)).toEqual(expectedResult);
    });

    it('should handle deleting array-like objects', () => {
        const sourceObject = { a: 1, b: 2, c: ['x', 'y', 'z'] };
        const diff = { c: '$DELETE' };
        const expectedResult = { a: 1, b: 2 };
        expect(applyDiff(sourceObject, diff)).toEqual(expectedResult);
    });

    it('should handle deleting from array-like objects', () => {
        const sourceObject = { a: 1, b: 2, c: ['x', 'y', 'z'] };
        const diff = { c: { 2: '$DELETE' } };
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