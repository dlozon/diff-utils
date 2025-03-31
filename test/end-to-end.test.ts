import { expect } from '@jest/globals'
import { createDiff, applyDiff, applyDiffs } from '../src/index';

describe('endToEndCreation', () => {
    it('should create diff 1 correctly', () => {
        const diff = createDiff(revision1, revision2);
        expect(diff).toEqual(expectedDiff1);
    });
    
    it('should create diff 2 correctly', () => {
        const diff = createDiff(revision2, revision3);
        expect(diff).toEqual(expectedDiff2);
    });

    it('should create diff 3 correctly', () => {
        const diff = createDiff(revision3, revision4);
        expect(diff).toEqual(expectedDiff3);
    });

    it('should create diff 4 correctly', () => {
        const diff = createDiff(revision4, revision5);
        expect(diff).toEqual(expectedDiff4);
    });
});

describe('endToEndApplication', () => {
    it('should correctly recreate revision 4 from diff', () => {
        const result = applyDiff(revision5, expectedDiff4);
        expect(result).toEqual(revision4);
    });
    
    it('should correctly recreate revision 3 from diff', () => {
        const result = applyDiff(revision4, expectedDiff3);
        expect(result).toEqual(revision3);
    });
    
    it('should correctly recreate revision 2 from diff', () => {
        const result = applyDiff(revision3, expectedDiff2);
        expect(result).toEqual(revision2);
    });
    
    it('should correctly recreate revision 1 from diff', () => {
        const result = applyDiff(revision2, expectedDiff1);
        expect(result).toEqual(revision1);
    });

    it('should apply a batch of diffs correctly', () => {
        const result = applyDiffs(revision5, [expectedDiff4, expectedDiff3, expectedDiff2, expectedDiff1]);
        expect(result).toEqual(revision1);
    });
});


const revision1 = {
    revision: 1,
    a: 0, b: 1, c: 2,
    array: ['a', 'b', 'c'],
    subObject: { x: 0, y: 1, z: 2 }
};
const revision2 = {
    revision: 2,
    a: 1, b: 2, c: 3,
    array: ['a', 'c', 'd'],
    subObject: { x: 0, y: 1 }
}
const revision3 = {
    revision: 3,
    a: 0, b: 3, c: 3,
    array: ['a', 'c', 'd'],
    subObject: { x: 2, y: 0 }
}
const revision4 = {
    revision: 4,
    a: 0, b: 3, d: 2,
    array: ['a', 'c', 'd', 'c'],
}
const revision5 = {
    revision: 5,
    a: 0, b: 3, d: 2,
    subObject: {
        array: ['a', 'c', 'd', 'c']
    }
}

const expectedDiff1 = {
    revision: { oldValue: 1, newValue: 2 },
    a: { oldValue: 0, newValue: 1 },
    b: { oldValue: 1, newValue: 2 },
    c: { oldValue: 2, newValue: 3 },
    array: { 1: { oldValue: 'b', newValue: 'c' }, 2: { oldValue: 'c', newValue: 'd' }},
    subObject: { z: { oldValue: 2, newValue: null }}
}
const expectedDiff2 = {
    revision: { oldValue: 2, newValue: 3 },
    a: { oldValue: 1, newValue: 0 },
    b: { oldValue: 2, newValue: 3 },
    subObject: { x: { oldValue: 0, newValue: 2 }, y: { oldValue: 1, newValue: 0 } }
}
const expectedDiff3 = {
    revision: { oldValue: 3, newValue: 4 },
    c: { oldValue: 3, newValue: null },
    d: { oldValue: null, newValue: 2 },
    array: { 3: { oldValue: null, newValue: 'c' } },
    subObject: { oldValue: { x: 2, y: 0 }, newValue: null }
}
const expectedDiff4 = {
    revision: { oldValue: 4, newValue: 5 },
    array: { oldValue: ['a', 'c', 'd', 'c'], newValue: null },
    subObject: { oldValue: null, newValue: { array: ['a', 'c', 'd', 'c'] } }
}