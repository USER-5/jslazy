import { isForwardLazy, lazy } from "./index.js";
import { forwardLazyIterable } from "./forwardLazyIterable.js";
// These should NOT be exported
const R_ITER = Symbol();
const LAZY_FLAG = Symbol();
/** Determines whether an iterable is compatible with `IntoLazy` */
export function isIntoLazy(val) {
    return (Symbol.iterator in val && R_ITER in val) || Array.isArray(val);
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
export function lazyHelper(iterable, callback) {
    // We need to return functions that call the callback each time we request a new iterable
    // Otherwise, we can only iterate once.
    if (isLazy(iterable)) {
        return lazy({
            [Symbol.iterator]() {
                return callback(iterable, false)[Symbol.iterator]();
            },
            [R_ITER]() {
                return callback(iterable.reverse(), true)[Symbol.iterator]();
            },
        });
    }
    return lazy({
        [Symbol.iterator]() {
            return callback(iterable, false)[Symbol.iterator]();
        },
    });
}
//# sourceMappingURL=lazyIterable.js.map