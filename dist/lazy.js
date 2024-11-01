import { lazyDoGen } from "./operators/do.js";
import { lazyFilterGen } from "./operators/filter.js";
import { lazyFlatMapGen } from "./operators/flatMap.js";
import { collectDeep, lazyAll, lazyAny } from "./operators/index.js";
import { lazyLimitGen } from "./operators/limit.js";
import { lazyMapGen } from "./operators/map.js";
import { lazyTakeUntilGen } from "./operators/takeUntil.js";
import { lazyTakeWhileGen } from "./operators/takeWhile.js";
import { lazyWindowsGen } from "./operators/window.js";
// These should NOT be exported
const R_ITER = Symbol();
const LAZY_FLAG = Symbol();
/** Determines whether an iterable has a reverse iterator on it */
export function isReversibleIterable(val) {
    return (typeof val === "object" &&
        val !== null &&
        Symbol.iterator in val &&
        R_ITER in val &&
        isLazy(val));
}
/** Determines whether an iterable is a lazy reversible iterable */
export function isReversibleLazy(val) {
    return isReversibleIterable(val) && isLazy(val);
}
/** Determines whether an iterable is a `LazyIterable`. */
export function isLazy(val) {
    return LAZY_FLAG in val && val[LAZY_FLAG] === true;
}
/**
 * Construct a lazy iterable from an existing iterable
 *
 * If possible, this will return a `LazyIterable`, which allows for lazy
 * reversing.
 *
 * ## Examples
 *
 * At it's simplest:
 *
 * ```ts
 * lazy([1, 2, 3])
 *   .map((v) => v * 2)
 *   .reverse()
 *   .collect() === [6, 4, 2];
 * ```
 *
 * @param source The array, set, or other iterable to convert.
 * @returns A LazyIterable from the provided source
 */
export function lazy(source) {
    // Allow pass-thru
    if (isLazy(source)) {
        return source;
    }
    return {
        [LAZY_FLAG]: true,
        [Symbol.iterator]() {
            return source[Symbol.iterator]();
        },
        filter(fn) {
            return lazyHelper(this, (iter) => lazyFilterGen(iter, fn));
        },
        do(fn) {
            return lazyHelper(this, (iter) => lazyDoGen(iter, fn));
        },
        map(fn) {
            return lazyHelper(this, (iter) => lazyMapGen(iter, fn));
        },
        flatMap(fn) {
            return lazyHelper(this, (iter, reversed) => lazyFlatMapGen(iter, fn, reversed));
        },
        limit(nValues) {
            return lazyHelper(this, (iter) => lazyLimitGen(iter, nValues));
        },
        takeWhile(fn) {
            return lazyHelper(this, (iter) => lazyTakeWhileGen(iter, fn));
        },
        takeUntil(fn) {
            return lazyHelper(this, (iter) => lazyTakeUntilGen(iter, fn));
        },
        collect() {
            return Array.from(this);
        },
        collectDeep() {
            return collectDeep(this);
        },
        any(fn) {
            return lazyAny(this, fn);
        },
        all(fn) {
            return lazyAll(this, fn);
        },
        windows(windowSize) {
            return lazyHelper(this, (iter) => lazyWindowsGen(iter, windowSize));
        },
        reverse() {
            return lazy({
                [R_ITER]: source[Symbol.iterator],
                [Symbol.iterator]: () => reverse(source),
            });
        },
    };
}
function* reverse(source) {
    if (isReversibleIterable(source)) {
        return source[R_ITER];
    }
    else if (Array.isArray(source)) {
        yield* arrayToReverseIterator(source);
    }
    else {
        const arrSource = Array.from(source);
        yield* arrayToReverseIterator(arrSource);
    }
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
    if (isReversibleLazy(iterable)) {
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
//# sourceMappingURL=lazy.js.map