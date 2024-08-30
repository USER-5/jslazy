import { lazyDo, type Action } from "./do";
import { lazyFilter } from "./filter";
import { lazyFlatMap } from "./flatMap";
import { lazyLimit } from "./limit";
import { lazyMap, type Mapper } from "./map";
import type { Predicate } from "./filter";
import { lazyTakeWhile } from "./takeWhile";

// This should NOT be exported
const LAZY_FLAG: unique symbol = Symbol();

export function isLazy<T>(val: Iterable<T>): val is LazyIterable<T> {
  return LAZY_FLAG in val && val[LAZY_FLAG] === true;
}

export interface LazyIterable<T> extends Iterable<T> {
  /** Filters out items which return 'false' when entered into the predicate */
  filter(predicate: Predicate<T>): LazyIterable<T>;
  /** Maps each value into a different value */
  map<V>(mapper: Mapper<T, V>): LazyIterable<V>;
  /** Flattens each item of the contained lazy arrays */
  flatMap<V>(mapper: Mapper<T, Iterable<V>>): LazyIterable<V>;
  /**
   * Runs the provided action on each item when the item is processed.
   *
   * Note that since this is lazy, the items will need to be "pulled through"
   * the iterator.
   */
  do(action: Action<T>): LazyIterable<T>;
  /** Collects the current array into a standard array */
  collect(): Array<T>;
  /**
   * Limits the number of values to _at most_ `nValues`. If the array ends
   * before reaching `nValues`, then this operator has no effect.
   */
  limit(nValues: number): LazyIterable<T>;
  /**
   * Passes through values until the predicate returns false, then terminates
   * the iterator
   */
  takeWhile(predicate: Predicate<T>): LazyIterable<T>;
  readonly [LAZY_FLAG]: true;
}

/**
 * Creates a reversible lazy array from the source.
 *
 * This is still in early development, and is subject to change.
 */
export function lazyIterable<T>(source: Iterable<T>): LazyIterable<T> {
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

    collect() {
      return Array.from(this);
    },
  };
}
