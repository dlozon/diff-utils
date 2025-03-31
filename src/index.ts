/** Creates an object that contains the differences between two versions of an object.
 *
 * @param oldObj - The original object.
 * @param newObj - The new object to diff against the original.
 * @returns A diff object that contains the changes.
 *  If a key is removed, the diff will contain the value from the old object.
 *  If a key is added, the value will be '$DELETE' to signify that the diff must delete the key to regenerate the old object.
 *  If a key is an object, the function will recursively diff that object.
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
                newValue: newObj[key]
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
 * @param diff - The diff object containing changes to be applied.
 *  If a value is '$DELETE', the corresponding key will be removed from the result.
 * @returns A new object with the diff applied.
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
 * @returns A new object with all diffs applied.
 */
export function applyDiffs(sourceObject: Record<string, any>, diffs: Record<string, any>[]): Record<string, any> {
    return diffs.reduce((currentObject, diff) => applyDiff(currentObject, diff), sourceObject);
}

// Helper function to determine if an object is array-like
function isArrayLike(obj: Record<string, any>): boolean {
    const keys = Object.keys(obj);
    return keys.length > 0 && keys.every((key, index) => key === index.toString());
}