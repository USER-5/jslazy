import { lazyDo } from "./do";
import { lazyFilter } from "./filter";
import { lazyFlatMap } from "./flatMap";
import { lazyLimit } from "./limit";
import { lazyMap } from "./map";
import { lazyTakeWhile } from "./takeWhile";
import { lazyAny } from "./any";
import { lazyTakeUntil } from "./takeUntil";
import { lazyAll } from "./all";
import { collectDeep } from "./collectDeep";
import { lazyWindow } from "./window";
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
        // This flags that we have a fully-fledged reversible lazy iterator.
        [FORWARD_LAZY_FLAG]: true,
        filter(fn) {
            return lazyFilter(this, fn);
        },
        do(fn) {
            return lazyDo(this, fn);
        },
        map(fn) {
            return lazyMap(this, fn);
        },
        flatMap(fn) {
            return lazyFlatMap(this, fn);
        },
        limit(nValues) {
            return lazyLimit(this, nValues);
        },
        takeWhile(fn) {
            return lazyTakeWhile(this, fn);
        },
        takeUntil(fn) {
            return lazyTakeUntil(this, fn);
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
            return lazyWindow(this, windowSize);
        },
    };
}
//# sourceMappingURL=forwardLazyIterable.js.map