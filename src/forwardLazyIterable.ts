import { lazyDoGen, type Action } from "./operators/do.js";
import { lazyFilterGen } from "./operators/filter.js";
import { lazyFlatMapGen } from "./operators/flatMap.js";
import { lazyLimitGen } from "./operators/limit.js";
import { lazyMapGen, type Mapper } from "./operators/map.js";
import type { Predicate } from "./operators/filter.js";
import { lazyTakeWhileGen } from "./operators/takeWhile.js";
import { lazyAny } from "./operators/any.js";
import { lazyTakeUntilGen } from "./operators/takeUntil.js";
import { lazyAll } from "./operators/all.js";
import { collectDeep, type CollectDeep } from "./operators/collectDeep.js";
import { lazyHelper, type LazyIterable } from "./lazyIterable.js";
import { lazyWindowsGen } from "./operators/window.js";

// This should NOT be exported
const FORWARD_LAZY_FLAG: unique symbol = Symbol();

/**
 * Determines whether the provided iterable is a ForwardLazyIterable.
 *
 * Note: A `ReversibleLazyIterable` will pass this check, as it's an extension
 * of `ForwardLazyIterable`
 */
export function isForwardLazy<T>(
  val: Iterable<T>,
): val is ForwardLazyIterable<T> {
  return FORWARD_LAZY_FLAG in val && val[FORWARD_LAZY_FLAG] === true;
}

/**
 * A lazily evaluated iterable.
 *
 * This is the core type for the _jslazy_ library, along with
 * `ReversibleLazyIterable`. `ForwardLazyIterable` objects cannot be reversed
 * lazily.
 *
 * `ForwardLazyIterables`, as their name suggests, are lazily evaluated, and
 * must be _consumed_ in order to perform work.
 */
export interface ForwardLazyIterable<T> extends Iterable<T> {
  /**
   * Filters out items which return 'false' when entered into the predicate.
   *
   * @param predicate A function applied to each value in-turn. If this function
   *   returns false, the value is omitted from the downstream iterable
   */
  filter(predicate: Predicate<T>): ForwardLazyIterable<T>;
  /**
   * Maps each value into a different value.
   *
   * @param mapper A function applied to each value in-turn. The return value of
   *   this function becomes the downstream iterable's value.
   */
  map<V>(mapper: Mapper<T, V>): ForwardLazyIterable<V>;

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
  flatMap<V>(mapper: Mapper<T, Iterable<V>>): ForwardLazyIterable<V>;

  /**
   * Runs the provided action on each item when the item is processed.
   *
   * @param action A function that is applied to each value in-turn.
   * @returns A new instance of the same iterable
   */
  do(action: Action<T>): ForwardLazyIterable<T>;

  /**
   * Collects the current array into a standard array.
   *
   * **This pulls values through the iterable**. Do _not_ call this method on
   * infinite iterables, unless you have a limiting operator.
   */
  collect(): Array<T>;

  /**
   * Collects the current array into a standard array, recursing as necessary.
   *
   * **This pulls values through the iterable**. Do _not_ call this method on
   * infinite iterables, unless you have a limiting operator.
   */
  collectDeep(): CollectDeep<T>;

  /**
   * Limits the number of values to _at most_ `nValues`. If the array ends
   * before reaching `nValues`, then this operator has no effect.
   *
   * @param nValues The maximum number of values to emit.
   */
  limit(nValues: number): ForwardLazyIterable<T>;

  /**
   * Passes through values until the predicate returns false, then terminates
   * the iterator.
   *
   * Note that this must pull the failing value through the chain in order to
   * evaluate it.
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
  takeWhile(predicate: Predicate<T>): ForwardLazyIterable<T>;

  /**
   * Passes through values until the predicate returns true, then terminates the
   * iterator.
   *
   * Note that this must pull the succeeding value through the chain in order to
   * evaluate it.
   *
   * ## Example
   *
   * ```ts
   * let seenBefore = 0;
   * let seenAfter = 0;
   * const lazyArray = lazy([1, 2, 3, 4, 5, 6])
   *   .do(() => seenBefore++)
   *   .takeUntil((v) => v > 3)
   *   .do(() => seenAfter++)
   *   .collect();
   *
   * lazyArray === [1, 2, 3]; // 4 is the first value > 3, so the rest is omitted
   * seenBefore === 3; // We had to evaluate 4 items
   * seenAfter === 2; // 3 items were emitted after the `takeUntil` operator
   * ```
   *
   * @param predicate A function applied to each value in-turn. If this function
   *   returns true, the value is not emitted, and the iterator terminates.
   */
  takeUntil(predicate: Predicate<T>): ForwardLazyIterable<T>;

  /**
   * Returns whether any value in the iterable returns true for the predicate,
   * exiting early if possible.
   *
   * This consumes values in order to produces its output, up until the
   * predicate returns true, or the iterable is exhausted.
   *
   * @param predicate A function that is executed on values produced by the
   *   iterable. If this returns true for any value, the operator exits and
   *   returns true.
   * @returns True if the predicate was true for any value in the iterable,
   *   False if the iterable exhausted without the predicate producing a truthy
   *   result.
   */
  any(predicate: Predicate<T>): boolean;

  /**
   * Returns whether all values in the iterable return true for the predicate,
   * exiting early if possible.
   *
   * This consumes values in order to produces its output, up until the
   * predicate returns false, or the iterable is exhausted.
   *
   * @param predicate A function that is executed on values produced by the
   *   iterable. If this returns true for all values, the operator returns true.
   *   If this returns false for any value, the operator exits and returns
   *   false.
   * @returns True if the predicate was true for all values in the iterable,
   *   False if any value caused the predicate to produce a falsy value.
   */
  all(predicate: Predicate<T>): boolean;

  /**
   * Returns an iterable of overlapping sections of the parent.
   *
   * Regardless of whether the parent was a `ForwardLazyIterable`, the children
   * iterable will always be reversible.
   *
   * ## Example
   *
   * ```ts
   * const myLazy = lazy([1, 2, 3]).windows(2).collect();
   * // myLazy = lazy([1,2]), lazy([2,3])
   * ```
   */
  windows(windowSize: number): ForwardLazyIterable<LazyIterable<T>>;
  readonly [FORWARD_LAZY_FLAG]: true;
}

/**
 * Creates a reversible lazy array from the source.
 *
 * This is still in early development, and is subject to change.
 */
export function forwardLazyIterable<T>(
  source: Iterable<T>,
): ForwardLazyIterable<T> {
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
      return lazyHelper(this, (iter: Iterable<T>) =>
        lazyFilterGen<T>(iter, fn),
      );
    },

    do(fn) {
      return lazyHelper(this, (iter: Iterable<T>) => lazyDoGen(iter, fn));
    },

    map(fn) {
      return lazyHelper(this, (iter: Iterable<T>) => lazyMapGen(iter, fn));
    },

    flatMap(fn) {
      return lazyHelper(this, (iter: Iterable<T>, reversed) =>
        lazyFlatMapGen(iter, fn, reversed),
      );
    },

    limit(nValues) {
      return lazyHelper(this, (iter: Iterable<T>) =>
        lazyLimitGen(iter, nValues),
      );
    },

    takeWhile(fn) {
      return lazyHelper(this, (iter: Iterable<T>) =>
        lazyTakeWhileGen(iter, fn),
      );
    },

    takeUntil(fn) {
      return lazyHelper(this, (iter: Iterable<T>) =>
        lazyTakeUntilGen(iter, fn),
      );
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

    windows(windowSize: number) {
      return lazyHelper(this, (iter: Iterable<T>) =>
        lazyWindowsGen(iter, windowSize),
      );
    },
  };
}
