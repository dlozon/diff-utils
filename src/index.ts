/** Creates a diff object that represents the differences between two objects.
 * 
 * @param oldObj - The previous version of an object
 * @param newObj - The new version of the object to compare to
 * @returns A diff object containing the changes between oldObj and newObj.
 *          For changed values, returns `{ oldValue: any, newValue: any }`.
 *          For nested objects, recursively includes sub-diffs.
 *          Only includes keys where values have actually changed.
 */
export function createDiff(oldObj: Record<string, any>, newObj: Record<string, any>): Record<string, any> {
    const diff: Record<string, any> = {};

    // Process keys in the old object
    for (const key in oldObj) {
        // If key is a nested json attempt to recursively add its changes to the diff
        if (typeof oldObj[key] === 'object' && newObj[key] != null) {
            const subDiff = createDiff(oldObj[key], newObj[key]);
            if (Object.keys(subDiff).length > 0)
                diff[key] = subDiff;
        }
        // If key is a primitive and the value has changed, add it to the diff
        else if (JSON.stringify(oldObj[key]) !== JSON.stringify(newObj[key])) {
            diff[key] = {
                oldValue: oldObj[key],
                newValue: newObj[key] ?? null
            };
        }
    }

    // Process keys in the new object that are not in the old object
    for (const key in newObj)
        if (!(key in oldObj))
            diff[key] = { oldValue: null, newValue: newObj[key] };

    return diff;
}

/** Applies a diff object to an object.
 *
 * @param sourceObject - The original object to which the diff will be applied.
 * @param diff - The diff object only containing changes to be applied.
 * @returns A new object created by applying values from diff to the sourceObject.
 */
export function applyDiff(sourceObject: Record<string, any>, diff: Record<string, any>): Record<string, any> {
    const result: Record<string, any> = { ...sourceObject };

    for (const key in diff) {
        if (diff.hasOwnProperty(key)) {
            if (typeof diff[key] === 'object' && diff[key] !== null && !Array.isArray(diff[key]) && !diff[key].hasOwnProperty('oldValue')) {
                result[key] = applyDiff(sourceObject[key], diff[key]);
            } 
            else if (diff[key].oldValue === null) {
                delete result[key];
            } 
            else {
                result[key] = diff[key].oldValue;
            }
        }
    }

    // Detect if the result object is array-like and reconstitute it as an array
    if (isArrayLike(result)) {
        return Object.values(result);
    }

    return result;
}

/** Applies a series of diffs to a source object in sequence, returning the final object with all diffs applied.
 * 
 * @param sourceObject - The original object to which the diffs will be applied.
 * @param diffs - An array of diff objects to be applied in sequence.
 * @returns A new object with all diffs applied sequentially.
 */
export function applyDiffs(sourceObject: Record<string, any>, diffs: Record<string, any>[]): Record<string, any> {
    return diffs.reduce((currentObject, diff) => applyDiff(currentObject, diff), sourceObject);
}

/** 
 * @generator Iterates through a diff object and yields the differences found.
 *
 * @param {Record<string, any>} diff The diff object to iterate through. The diff object is expected to have a structure where each key represents a property that has changed.
 *                                    If a value is an object itself (and not an array or null), it's treated as a nested diff and the function recurses into it.
 *                                    Otherwise, the value is expected to be an object with `oldValue` and `newValue` properties representing the changes.
 * @param {string[]} [path=[]] The path to the current diff object. This is used to keep track of the location of the diff in the original object. 
 *                             Leave empty to iterate over the entire object.
 *
 * @yields {{ path: string[], key: string, oldValue: any, newValue: any }} An object representing a single difference found in the diff object.
 *         The object contains the key of the property that has changed, the old and new values of the property, and the path to the property in the original object.
 */
export function* diffIterator(diff: Record<string, any>, path: string[] = []): Generator<{ key: string, oldValue: any, newValue: any, path: string[] }> {
    for (const key in diff) {
        if (diff.hasOwnProperty(key)) {
            const currentPath = [...path, key];
            if (typeof diff[key] === 'object' && diff[key] !== null && !Array.isArray(diff[key]) && !diff[key].hasOwnProperty('oldValue')) {
                // If the value is a sub-object, recursively yield its diffs
                yield* diffIterator(diff[key], currentPath);
            }
            else {
                // If the value is a primitive, yield the diff
                yield {
                    path: currentPath,
                    key: key,
                    oldValue: diff[key].oldValue,
                    newValue: diff[key].newValue,
                };
            }
        }
    }
}

/** @returns if the input is an array-like structure */
function isArrayLike(obj: Record<string, any>): boolean {
    const keys = Object.keys(obj);
    return keys.length > 0 && keys.every((key, index) => key === index.toString());
}