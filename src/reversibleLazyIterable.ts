import type { Action } from "./do";
import type { Predicate } from "./filter";
import { isLazy, lazyIterable, type LazyIterable } from "./lazyIterable";
import type { Mapper } from "./map";

// These should NOT be exported
const R_ITER: unique symbol = Symbol();
const R_LAZY: unique symbol = Symbol();

export type IntoReversibleLazy<T> =
  | (ReversibleIterable<T> & Iterable<T>)
  | Array<T>;

export interface ReversibleIterable<T> {
  [R_ITER](): Iterator<T>;
}

export function isIntoReversibleLazy<T>(
  val: Iterable<T>,
): val is IntoReversibleLazy<T> {
  return isReversibleLazy(val) || Array.isArray(val);
}

export function isReversibleLazy<T>(
  val: Iterable<T>,
): val is ReversibleLazyIterable<T> {
  return isLazy(val) && R_LAZY in val && val[R_LAZY] === true;
}

export interface ReversibleLazyIterable<T>
  extends ReversibleIterable<T>,
    LazyIterable<T> {
  /** Filters out items which return 'false' when entered into the predicate */
  filter(predicate: Predicate<T>): ReversibleLazyIterable<T>;
  /** Maps each value into a different value */
  map<V>(mapper: Mapper<T, V>): ReversibleLazyIterable<V>;
  /** Flattens each item of the contained lazy arrays */
  flatMap<V, MapperIter extends Iterable<V>>(
    mapper: Mapper<T, MapperIter>,
  ): MapperIter extends IntoReversibleLazy<V>
    ? ReversibleLazyIterable<V>
    : LazyIterable<V>;
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

export function rLazyIterable<T>(
  source: IntoReversibleLazy<T>,
): ReversibleLazyIterable<T> {
  if (isReversibleLazy(source)) {
    return source;
  }

  return {
    ...(lazyIterable(source) as ReversibleLazyIterable<T>),
    [R_ITER]() {
      return R_ITER in source
        ? source[R_ITER]()
        : arrayToReverseIterator(source);
    },

    reverse() {
      return rLazyIterable({
        [Symbol.iterator]: this[R_ITER],
        [R_ITER]: this[Symbol.iterator],
      });
    },

    [R_LAZY]: true,
  };
}

function* arrayToReverseIterator<T>(arr: Array<T>): Iterator<T> {
  // Unfortunately, unless we want to eagerly evaluate this, we have to manually
  // iterate in reverse.
  for (let index = arr.length - 1; index >= 0; index--) {
    yield arr[index]!;
  }
}

/**
 * Applies the provided function to both forward and reverse iterators
 *
 * @param lazy The lazy array to operate on
 * @param func A function that takes 1 or 2 parameters
 */
export function reverseHelper<
  InItem,
  OutItem,
  InIterable extends LazyIterable<InItem>,
  OutIterable = InIterable extends LazyIterable<InItem>
    ? LazyIterable<OutItem>
    : ReversibleLazyIterable<OutItem>,
>(
  lazy: InIterable,
  func: (
    it: Iterator<InItem, any, undefined>,
    iteratorProp: typeof R_ITER | typeof Symbol.iterator,
  ) => () => IteratorResult<OutItem>,
): OutIterable {
  if (isReversibleLazy(lazy)) {
    const forwardNext = func(lazy[Symbol.iterator](), Symbol.iterator);
    const reverseNext = func(lazy[R_ITER](), R_ITER);
    return rLazyIterable({
      [Symbol.iterator]() {
        return { next: forwardNext };
      },
      [R_ITER]() {
        return { next: reverseNext };
      },
    }) as OutIterable;
  } else {
    const forwardNext = func(lazy[Symbol.iterator](), Symbol.iterator);
    return lazyIterable({
      [Symbol.iterator]() {
        return { next: forwardNext };
      },
    }) as OutIterable;
  }
}
