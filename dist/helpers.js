import { reverseHelper, } from "./reversibleLazyIterable";
/** A simple helper, useful for implementing basic operators */
export function simpleHelper(lazyArray, callback) {
    return reverseHelper(lazyArray, (iterator, _) => {
        return cloneAccessor(iterator, callback);
    });
}
/**
 * Given an iterator, users can define a callback that returns an
 * `AccessorResult`.
 *
 * This can be used to filter and map values.
 */
export function cloneAccessor(iterator, callback) {
    const next = () => {
        // Consume the parent at consumption time
        while (true) {
            const parentNext = iterator.next();
            if (parentNext.done === true) {
                return parentNext;
            }
            const callbackVal = callback(parentNext.value);
            // If filter is defined, and false, then the item is omitted
            if (callbackVal.filter === undefined || callbackVal.filter === true) {
                return callbackVal.item;
            }
        }
    };
    return next;
}
//# sourceMappingURL=helpers.js.map