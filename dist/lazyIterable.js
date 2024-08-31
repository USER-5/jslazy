import { isForwardLazy } from "./index";
import { forwardLazyIterable } from "./forwardLazyIterable";
// These should NOT be exported
const R_ITER = Symbol();
const LAZY_FLAG = Symbol();
/** Determines whether an iterable is compatible with `IntoLazy` */
export function isIntoLazy(val) {
    return isLazy(val) || Array.isArray(val);
}
/** Determines whether an iterable is a `LazyIterable`. */
export function isLazy(val) {
    return isForwardLazy(val) && LAZY_FLAG in val && val[LAZY_FLAG] === true;
}
export function rLazyIterable(source) {
    if (isLazy(source)) {
        return source;
    }
    return {
        ...forwardLazyIterable(source),
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
        [LAZY_FLAG]: true,
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
    const forwardNext = func(lazy[Symbol.iterator](), Symbol.iterator);
    if (isLazy(lazy)) {
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
        return forwardLazyIterable({
            [Symbol.iterator]() {
                return { next: forwardNext };
            },
        });
    }
}
//# sourceMappingURL=lazyIterable.js.map