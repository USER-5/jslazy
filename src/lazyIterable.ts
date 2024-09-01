import type { Action } from "./do.js";
import type { Predicate } from "./filter.js";
import { isForwardLazy, lazy, type ForwardLazyIterable } from "./index.js";
import { forwardLazyIterable } from "./forwardLazyIterable.js";
import type { Mapper } from "./map.js";

// These should NOT be exported
const R_ITER: unique symbol = Symbol();
const LAZY_FLAG: unique symbol = Symbol();

/**
 * Represents the union of types that we can convert into a `LazyIterable`
 *
 * Either:
 *
 * 1. A JS `Array` of elements, or
 * 2. Something which implements both the `Iterable` interface, and the
 *    `ReversibleIterable` interface. - that is, it contains two iterators.
 */
export type IntoLazy<T> = (ReversibleIterable<T> & Iterable<T>) | Array<T>;

export interface ReversibleIterable<T> {
  [R_ITER](): Iterator<T>;
}

/** Determines whether an iterable is compatible with `IntoLazy` */
export function isIntoLazy<T>(val: Iterable<T>): val is IntoLazy<T> {
  return (Symbol.iterator in val && R_ITER in val) || Array.isArray(val);
}

/** Determines whether an iterable is a `LazyIterable`. */
export function isLazy<T>(val: Iterable<T>): val is LazyIterable<T> {
  return isForwardLazy(val) && LAZY_FLAG in val && val[LAZY_FLAG] === true;
}

/**
 * A lazily evaluated iterable, which is lazily reversable.
 *
 * This is the core type for the _jslazy_ library, along with
 * `ForwardLazyIterable`. The library will return a `LazyIterable` if possible.
 *
 * `LazyIterables`, as their name suggests, are lazily evaluated, and must be
 * _consumed_ in order to perform work.
 */
export interface LazyIterable<T>
  extends ReversibleIterable<T>,
    ForwardLazyIterable<T> {
  // Overrides of the ForwardLazyIterable
  filter(predicate: Predicate<T>): LazyIterable<T>;

  map<V>(mapper: Mapper<T, V>): LazyIterable<V>;

  flatMap<V, MapperIter extends Iterable<V>>(
    mapper: Mapper<T, MapperIter>,
  ): MapperIter extends IntoLazy<V> ? LazyIterable<V> : ForwardLazyIterable<V>;

  do(action: Action<T>): LazyIterable<T>;

  collect(): Array<T>;

  limit(nValues: number): LazyIterable<T>;

  takeWhile(predicate: Predicate<T>): LazyIterable<T>;

  windows(windowSize: number): LazyIterable<LazyIterable<T>>;

  /**
   * Reverses the iterable
   *
   * This is non-mutating, and lazy.
   */
  reverse(): LazyIterable<T>;

  readonly [LAZY_FLAG]: true;
}

export function rLazyIterable<T>(source: IntoLazy<T>): LazyIterable<T> {
  if (isLazy(source)) {
    return source;
  }

  return {
    ...(forwardLazyIterable(source) as LazyIterable<T>),
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

    [LAZY_FLAG]: true,
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
  InIterable extends ForwardLazyIterable<InItem>,
  OutIterable = InIterable extends ForwardLazyIterable<InItem>
    ? ForwardLazyIterable<OutItem>
    : LazyIterable<OutItem>,
>(
  iterable: InIterable,
  func: (
    it: Iterator<InItem, any, undefined>,
    iteratorProp: typeof R_ITER | typeof Symbol.iterator,
  ) => () => IteratorResult<OutItem>,
): OutIterable {
  const forwardNext = func(iterable[Symbol.iterator](), Symbol.iterator);
  if (isLazy(iterable)) {
    const reverseNext = func(iterable[R_ITER](), R_ITER);
    return lazy({
      [Symbol.iterator]() {
        return { next: forwardNext };
      },
      [R_ITER]() {
        return { next: reverseNext };
      },
    }) as OutIterable;
  } else {
    return lazy({
      [Symbol.iterator]() {
        return { next: forwardNext };
      },
    }) as OutIterable;
  }
}

export function lazyHelper<InItem, OutItem, InIter extends Iterable<InItem>>(
  iterable: InIter,
  callback: (iterable: Iterable<InItem>, reverse: boolean) => Iterable<OutItem>,
): InIter extends LazyIterable<OutItem>
  ? LazyIterable<OutItem>
  : ForwardLazyIterable<OutItem> {
  // We need to return functions that call the callback each time we request a new iterable
  // Otherwise, we can only iterate once.
  if (isLazy(iterable)) {
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
