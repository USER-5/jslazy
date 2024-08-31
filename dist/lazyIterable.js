import { lazyDo } from "./do";
import { lazyFilter } from "./filter";
import { lazyFlatMap } from "./flatMap";
import { lazyLimit } from "./limit";
import { lazyMap } from "./map";
import { lazyTakeWhile } from "./takeWhile";
import { lazyAny } from "./any";
import { lazyTakeUntil } from "./takeUntil";
import { lazyAll } from "./all";
// This should NOT be exported
const LAZY_FLAG = Symbol();
/**
 * Determines whether the provided iterable is a LazyIterable.
 *
 * Note: A `ReversibleLazyIterable` will pass this check, as it's an extension
 * of `LazyIterable`
 */
export function isLazy(val) {
    return LAZY_FLAG in val && val[LAZY_FLAG] === true;
}
/**
 * Creates a reversible lazy array from the source.
 *
 * This is still in early development, and is subject to change.
 */
export function lazyIterable(source) {
    // Allow pass-thru
    if (isLazy(source)) {
        return source;
    }
    return {
        [Symbol.iterator]() {
            return source[Symbol.iterator]();
        },
        // This flags that we have a fully-fledged reversible lazy iterator.
        [LAZY_FLAG]: true,
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
        any(fn) {
            return lazyAny(this, fn);
        },
        all(fn) {
            return lazyAll(this, fn);
        },
    };
}
//# sourceMappingURL=lazyIterable.js.map