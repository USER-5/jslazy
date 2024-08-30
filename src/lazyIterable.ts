import { arrayToReverseIterator } from "./converters";
import { lazyDo, type Action } from "./do";
import { lazyFilter } from "./filter";
import { lazyFlatMap } from "./flatMap";
import {
  isReversibleLazy,
  R_ITER,
  R_LAZY,
  type ReversibleIterable,
} from "./iter";
import { lazyLimit } from "./limit";
import { lazyMap, type Mapper } from "./map";
import type { Predicate } from "./predicate";
import { lazyTakeWhile } from "./takeWhile";

export type IntoReversibleLazy<T> =
  | (ReversibleIterable<T> & Iterable<T>)
  | Array<T>;

export interface ReversibleLazy<T> extends Iterable<T>, ReversibleIterable<T> {
  /** Filters out items which return 'false' when entered into the predicate */
  filter(predicate: Predicate<T>): ReversibleLazy<T>;
  /** Maps each value into a different value */
  map<V>(mapper: Mapper<T, V>): ReversibleLazy<V>;
  /** Flattens each item of the contained lazy arrays */
  flatMap<V>(mapper: Mapper<T, IntoReversibleLazy<V>>): ReversibleLazy<V>;
  /**
   * Runs the provided action on each item when the item is processed.
   *
   * Note that since this is lazy, the items will need to be "pulled through"
   * the iterator.
   */
  do(action: Action<T>): ReversibleLazy<T>;
  /** Collects the current array into a standard array */
  collect(): Array<T>;
  /**
   * Limits the number of values to _at most_ `nValues`. If the array ends
   * before reaching `nValues`, then this operator has no effect.
   */
  limit(nValues: number): ReversibleLazy<T>;
  /**
   * Passes through values until the predicate returns false, then terminates
   * the iterator
   */
  takeWhile(predicate: Predicate<T>): ReversibleLazy<T>;
  /** Reverses the current lazy array. */
  reverse(): ReversibleLazy<T>;
  readonly [R_LAZY]: true;
}

/**
 * Creates a reversible lazy array from the source.
 *
 * This is still in early development, and is subject to change.
 */
export function lazy<T>(source: IntoReversibleLazy<T>): ReversibleLazy<T> {
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
