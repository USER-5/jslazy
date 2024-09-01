import { lazyDo } from "./do.js";
import { lazyFilter } from "./filter.js";
import { lazyFlatMap } from "./flatMap.js";
import { lazyLimit } from "./limit.js";
import { lazyMap } from "./map.js";
import { lazyTakeWhile } from "./takeWhile.js";
import { lazyAny } from "./any.js";
import { lazyTakeUntil } from "./takeUntil.js";
import { lazyAll } from "./all.js";
import { collectDeep } from "./collectDeep.js";
import { lazyHelper } from "./lazyIterable.js";
import { lazyWindows } from "./window.js";
// This should NOT be exported
const FORWARD_LAZY_FLAG = Symbol();
/**
 * Determines whether the provided iterable is a ForwardLazyIterable.
 *
 * Note: A `ReversibleLazyIterable` will pass this check, as it's an extension
 * of `ForwardLazyIterable`
 */
export function isForwardLazy(val) {
    return FORWARD_LAZY_FLAG in val && val[FORWARD_LAZY_FLAG] === true;
}
/**
 * Creates a reversible lazy array from the source.
 *
 * This is still in early development, and is subject to change.
 */
export function forwardLazyIterable(source) {
    // Allow pass-thru
    if (isForwardLazy(source)) {
        return source;
    }
    return {
        [Symbol.iterator]() {
            return source[Symbol.iterator]();
        },
        // This flags that we have a fully-fledged lazy iterator.
        [FORWARD_LAZY_FLAG]: true,
        filter(fn) {
            return lazyHelper(this, (iter) => lazyFilter(iter, fn));
        },
        do(fn) {
            return lazyHelper(this, (iter) => lazyDo(iter, fn));
        },
        map(fn) {
            return lazyHelper(this, (iter) => lazyMap(iter, fn));
        },
        flatMap(fn) {
            return lazyHelper(this, (iter, reversed) => lazyFlatMap(iter, fn, reversed));
        },
        limit(nValues) {
            return lazyHelper(this, (iter) => lazyLimit(iter, nValues));
        },
        takeWhile(fn) {
            return lazyHelper(this, (iter) => lazyTakeWhile(iter, fn));
        },
        takeUntil(fn) {
            return lazyHelper(this, (iter) => lazyTakeUntil(iter, fn));
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
            return lazyHelper(this, (iter) => lazyWindows(iter, windowSize));
        },
    };
}
//# sourceMappingURL=forwardLazyIterable.js.map