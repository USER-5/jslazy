import type { Action } from "./do";
import type { Predicate } from "./filter";
import { type LazyIterable } from "./lazyIterable";
import type { Mapper } from "./map";
declare const R_ITER: unique symbol;
declare const R_LAZY: unique symbol;
export type IntoReversibleLazy<T> = (ReversibleIterable<T> & Iterable<T>) | Array<T>;
export interface ReversibleIterable<T> {
    [R_ITER](): Iterator<T>;
}
export declare function isIntoReversibleLazy<T>(val: Iterable<T>): val is IntoReversibleLazy<T>;
export declare function isReversibleLazy<T>(val: Iterable<T>): val is ReversibleLazyIterable<T>;
export interface ReversibleLazyIterable<T> extends ReversibleIterable<T>, LazyIterable<T> {
    /** Filters out items which return 'false' when entered into the predicate */
    filter(predicate: Predicate<T>): ReversibleLazyIterable<T>;
    /** Maps each value into a different value */
    map<V>(mapper: Mapper<T, V>): ReversibleLazyIterable<V>;
    /** Flattens each item of the contained lazy arrays */
    flatMap<V, MapperIter extends Iterable<V>>(mapper: Mapper<T, MapperIter>): MapperIter extends IntoReversibleLazy<V> ? ReversibleLazyIterable<V> : LazyIterable<V>;
    /**
     * Runs the provided action on each item when the item is processed.
     *
     * Note that since this is lazy, the items will need to be "pulled through"
     * the iterator.
     */
    do(action: Action<T>): ReversibleLazyIterable<T>;
    /** Collects the current array into a standard array */
    collect(): Array<T>;
    /**
     * Limits the number of values to _at most_ `nValues`. If the array ends
     * before reaching `nValues`, then this operator has no effect.
     */
    limit(nValues: number): ReversibleLazyIterable<T>;
    /**
     * Passes through values until the predicate returns false, then terminates
     * the iterator
     */
    takeWhile(predicate: Predicate<T>): ReversibleLazyIterable<T>;
    /** Reverses the current lazy array. */
    reverse(): ReversibleLazyIterable<T>;
    readonly [R_LAZY]: true;
}
export declare function rLazyIterable<T>(source: IntoReversibleLazy<T>): ReversibleLazyIterable<T>;
/**
 * Applies the provided function to both forward and reverse iterators
 *
 * @param lazy The lazy array to operate on
 * @param func A function that takes 1 or 2 parameters
 */
export declare function reverseHelper<InItem, OutItem, InIterable extends LazyIterable<InItem>, OutIterable = InIterable extends LazyIterable<InItem> ? LazyIterable<OutItem> : ReversibleLazyIterable<OutItem>>(lazy: InIterable, func: (it: Iterator<InItem, any, undefined>, iteratorProp: typeof R_ITER | typeof Symbol.iterator) => () => IteratorResult<OutItem>): OutIterable;
export {};
