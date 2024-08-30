import { type Action } from "./do";
import { type Mapper } from "./map";
import type { Predicate } from "./filter";
declare const LAZY_FLAG: unique symbol;
/**
 * Determines whether the provided iterable is a LazyIterable.
 *
 * Note: A `ReversibleLazyIterable` will pass this check, as it's an extension
 * of `LazyIterable`
 */
export declare function isLazy<T>(val: Iterable<T>): val is LazyIterable<T>;
/**
 * A lazily evaluated iterable.
 *
 * This is the core type for the _jslazy_ library, along with
 * `ReversibleLazyIterable`.
 *
 * `LazyIterables`, as their name suggests, are lazily evaluated, and must be
 * _consumed_ in order to perform work.
 */
export interface LazyIterable<T> extends Iterable<T> {
    /**
     * Filters out items which return 'false' when entered into the predicate.
     *
     * @param predicate A function applied to each value in-turn. If this function
     *   returns false, the value is omitted from the downstream iterable
     */
    filter(predicate: Predicate<T>): LazyIterable<T>;
    /**
     * Maps each value into a different value.
     *
     * @param mapper A function applied to each value in-turn. The return value of
     *   this function becomes the downstream iterable's value.
     */
    map<V>(mapper: Mapper<T, V>): LazyIterable<V>;
    /**
     * Flattens each item of the contained lazy arrays.
     *
     * ## Example
     *
     * ```ts
     * const people = lazy([
     *   {
     *     name: "John",
     *     children: ["James", "Jacob"],
     *   },
     *   {
     *     name: "Alice",
     *     children: ["Amber", "Alex"],
     *   },
     * ]);
     * const childNames = people
     *   .flatMap((person) => person.children)
     *   .collect();
     * // = ["James", "Jacob", "Amber", "Alex"];
     * ```
     *
     * @param mapper A function applied to each value in-turn. The return value of
     *   this function is used as an iterable, to provide downstream values.
     */
    flatMap<V>(mapper: Mapper<T, Iterable<V>>): LazyIterable<V>;
    /**
     * Runs the provided action on each item when the item is processed.
     *
     * @param action A function that is applied to each value in-turn.
     * @returns A new instance of the same iterable
     */
    do(action: Action<T>): LazyIterable<T>;
    /**
     * Collects the current array into a standard array.
     *
     * **This pulls values through the iterable**. Do _not_ call this method on
     * infinite iterables, unless you have a limiting operator.
     */
    collect(): Array<T>;
    /**
     * Limits the number of values to _at most_ `nValues`. If the array ends
     * before reaching `nValues`, then this operator has no effect.
     *
     * @param nValues The maximum number of values to emit.
     */
    limit(nValues: number): LazyIterable<T>;
    /**
     * Passes through values until the predicate returns false, then terminates
     * the iterator.
     *
     * Note that this must pull the failing value through the chain in order to
     * evalutate it.
     *
     * ## Example
     *
     * ```ts
     * let seenBefore = 0;
     * let seenAfter = 0;
     * const lazyArray = lazy([1, 2, "hi", 4, 5])
     *   .do(() => seenBefore++)
     *   .takeWhile((v) => Number.isInteger(v))
     *   .do(() => seenAfter++)
     *   .collect();
     *
     * lazyArray === [1, 2]; // "hi" failed, so the rest is omitted
     * seenBefore === 3; // We had to evaluate 3 items
     * seenAfter === 2; // 2 items were emitted after the `takeWhile` operator
     * ```
     *
     * @param predicate A function applied to each value in-turn. If this function
     *   returns false, the value is not emitted, and the iterator terminates.
     */
    takeWhile(predicate: Predicate<T>): LazyIterable<T>;
    readonly [LAZY_FLAG]: true;
}
/**
 * Creates a reversible lazy array from the source.
 *
 * This is still in early development, and is subject to change.
 */
export declare function lazyIterable<T>(source: Iterable<T>): LazyIterable<T>;
export {};
