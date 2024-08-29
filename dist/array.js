import { arrayToReverseIterator } from "./converters";
import { lazyDo } from "./do";
import { lazyFilter } from "./filter";
import { lazyFlatMap } from "./flatMap";
import { isReversibleLazy, R_ITER, R_LAZY, } from "./iter";
import { lazyLimit } from "./limit";
import { lazyMap } from "./map";
import { lazyTakeWhile } from "./takeWhile";
/**
 * Creates a reversible lazy array from the source.
 *
 * This is still in early development, and is subject to change.
 */
export function lazy(source) {
    // Allow pass-thru
    if (isReversibleLazy(source)) {
        return source;
    }
    return {
        [Symbol.iterator]() {
            return source[Symbol.iterator]();
        },
        [R_ITER]() {
            return Array.isArray(source)
                ? arrayToReverseIterator(source)
                : source[R_ITER]();
        },
        // This flags that we have a fully-fledged reversible lazy iterator.
        // Including the functions below (not just that we have the two iterators above)
        [R_LAZY]: true,
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
        reverse() {
            return lazy({
                [Symbol.iterator]: this[R_ITER],
                [R_ITER]: this[Symbol.iterator],
            });
        },
        collect() {
            return Array.from(this);
        },
    };
}
//# sourceMappingURL=array.js.map