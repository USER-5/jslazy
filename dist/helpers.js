import { lazy } from "./array";
import { R_ITER } from "./iter";
export function simpleHelper(lazyArray, callback) {
    return forwardReverseHelper(lazyArray, (iterator, _) => {
        return cloneAccessor(iterator, callback);
    });
}
/** Applies the provided function to both forward and reverse iterators */
export function forwardReverseHelper(lazyArray, func) {
    const forwardNext = func(lazyArray[Symbol.iterator](), Symbol.iterator);
    const reverseNext = func(lazyArray[R_ITER](), R_ITER);
    return lazy({
        [Symbol.iterator]() {
            return { next: forwardNext };
        },
        [R_ITER]() {
            return { next: reverseNext };
        },
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