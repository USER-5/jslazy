import { isLazy, lazyIterable } from "./lazyIterable";
// These should NOT be exported
const R_ITER = Symbol();
const R_LAZY = Symbol();
export function isIntoReversibleLazy(val) {
    return isReversibleLazy(val) || Array.isArray(val);
}
export function isReversibleLazy(val) {
    return isLazy(val) && R_LAZY in val && val[R_LAZY] === true;
}
export function rLazyIterable(source) {
    if (isReversibleLazy(source)) {
        return source;
    }
    return {
        ...lazyIterable(source),
        [R_ITER]() {
            return R_ITER in source
                ? source[R_ITER]()
                : arrayToReverseIterator(source);
        },
        reverse() {
            return rLazyIterable({
                [Symbol.iterator]: this[R_ITER],
                [R_ITER]: this[Symbol.iterator],
            });
        },
        [R_LAZY]: true,
    };
}
function* arrayToReverseIterator(arr) {
    // Unfortunately, unless we want to eagerly evaluate this, we have to manually
    // iterate in reverse.
    for (let index = arr.length - 1; index >= 0; index--) {
        yield arr[index];
    }
}
/**
 * Applies the provided function to both forward and reverse iterators
 *
 * @param lazy The lazy array to operate on
 * @param func A function that takes 1 or 2 parameters
 */
export function reverseHelper(lazy, func) {
    if (isReversibleLazy(lazy)) {
        const forwardNext = func(lazy[Symbol.iterator](), Symbol.iterator);
        const reverseNext = func(lazy[R_ITER](), R_ITER);
        return rLazyIterable({
            [Symbol.iterator]() {
                return { next: forwardNext };
            },
            [R_ITER]() {
                return { next: reverseNext };
            },
        });
    }
    else {
        const forwardNext = func(lazy[Symbol.iterator](), Symbol.iterator);
        return lazyIterable({
            [Symbol.iterator]() {
                return { next: forwardNext };
            },
        });
    }
}
//# sourceMappingURL=reversibleLazyIterable.js.map