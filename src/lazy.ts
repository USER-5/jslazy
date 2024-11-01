import type { CollectDeep } from "./operators/collectDeep.js";
import { lazyDoGen, type Action } from "./operators/do.js";
import { lazyFilterGen, type Predicate } from "./operators/filter.js";
import { lazyFlatMapGen } from "./operators/flatMap.js";
import { collectDeep, lazyAll, lazyAny } from "./operators/index.js";
import { lazyLimitGen } from "./operators/limit.js";
import { lazyMapGen, type Mapper } from "./operators/map.js";
import { lazyTakeUntilGen } from "./operators/takeUntil.js";
import { lazyTakeWhileGen } from "./operators/takeWhile.js";
import { lazyWindowsGen } from "./operators/window.js";

// These should NOT be exported
const R_ITER: unique symbol = Symbol();
const LAZY_FLAG: unique symbol = Symbol();

export interface ReversibleIterable<T> extends LazyIterable<T> {
  [R_ITER](): Iterator<T>;
}

/** Determines whether an iterable has a reverse iterator on it */
export function isReversibleIterable<T>(
  val: unknown,
): val is ReversibleIterable<T> {
  return (
    typeof val === "object" &&
    val !== null &&
    Symbol.iterator in val &&
    R_ITER in val &&
    isLazy(val as Iterable<T>)
  );
}

/** Determines whether an iterable is a lazy reversible iterable */
export function isReversibleLazy<T>(
  val: unknown,
): val is LazyIterable<T> & ReversibleIterable<T> {
  return isReversibleIterable(val) && isLazy(val);
}

/** Determines whether an iterable is a `LazyIterable`. */
export function isLazy<T>(val: Iterable<T>): val is LazyIterable<T> {
  return LAZY_FLAG in val && val[LAZY_FLAG] === true;
}

/**
 * A lazily evaluated iterable.
 *
 * This is the core type for the _jslazy_ library.
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
  limit(nValues: number): LazyIterable<T>;

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
  takeWhile(predicate: Predicate<T>): LazyIterable<T>;

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
  takeUntil(predicate: Predicate<T>): LazyIterable<T>;

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
   * ## Example
   *
   * ```ts
   * const myLazy = lazy([1, 2, 3]).windows(2).collect();
   * // myLazy = lazy([1,2]), lazy([2,3])
   * ```
   */
  windows(windowSize: number): LazyIterable<LazyIterable<T>>;

  /**
   * Reverses the iterable
   *
   * This is non-mutating, and lazy if the root data source is an array.
   *
   * This will spin forever if provided with an infinite iterable.
   */
  reverse(): LazyIterable<T>;

  readonly [LAZY_FLAG]: true;
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
export function lazy<Items>(
  source: Iterable<Items> | ReversibleIterable<Items>,
): LazyIterable<Items> {
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
      return lazyHelper(this, (iter: Iterable<Items>) =>
        lazyFilterGen<Items>(iter, fn),
      );
    },

    do(fn) {
      return lazyHelper(this, (iter: Iterable<Items>) => lazyDoGen(iter, fn));
    },

    map(fn) {
      return lazyHelper(this, (iter: Iterable<Items>) => lazyMapGen(iter, fn));
    },

    flatMap(fn) {
      return lazyHelper(this, (iter: Iterable<Items>, reversed) =>
        lazyFlatMapGen(iter, fn, reversed),
      );
    },

    limit(nValues) {
      return lazyHelper(this, (iter: Iterable<Items>) =>
        lazyLimitGen(iter, nValues),
      );
    },

    takeWhile(fn) {
      return lazyHelper(this, (iter: Iterable<Items>) =>
        lazyTakeWhileGen(iter, fn),
      );
    },

    takeUntil(fn) {
      return lazyHelper(this, (iter: Iterable<Items>) =>
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
      return lazyHelper(this, (iter: Iterable<Items>) =>
        lazyWindowsGen(iter, windowSize),
      );
    },

    reverse() {
      return lazy({
        [R_ITER]: source[Symbol.iterator],
        [Symbol.iterator]: () => reverse(source),
      });
    },
  };
}

function* reverse<T>(source: Iterable<T>): Iterator<T> {
  if (isReversibleIterable<T>(source)) {
    return source[R_ITER];
  } else if (Array.isArray(source)) {
    yield* arrayToReverseIterator(source);
  } else {
    const arrSource = Array.from(source);
    yield* arrayToReverseIterator(arrSource);
  }
}

function* arrayToReverseIterator<T>(arr: Array<T>): Iterable<T> {
  // Unfortunately, unless we want to eagerly evaluate this, we have to manually
  // iterate in reverse.
  for (let index = arr.length - 1; index >= 0; index--) {
    yield arr[index]!;
  }
}

export function lazyHelper<InItem, OutItem, InIter extends Iterable<InItem>>(
  iterable: InIter,
  callback: (iterable: Iterable<InItem>, reverse: boolean) => Iterable<OutItem>,
): LazyIterable<OutItem> {
  // We need to return functions that call the callback each time we request a new iterable
  // Otherwise, we can only iterate once.
  if (isReversibleLazy<InItem>(iterable)) {
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
  }) as any;
}
