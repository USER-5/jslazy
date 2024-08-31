import type { Action } from "./do";
import type { Predicate } from "./filter";
import { isLazy, type LazyIterable } from "./index";
import { lazyIterable } from "./forwardLazyIterable";
import type { Mapper } from "./map";

// These should NOT be exported
const R_ITER: unique symbol = Symbol();
const R_LAZY: unique symbol = Symbol();

/**
 * Represents the union of types that we can convert into a
 * `ReversibleLazyIterable`
 *
 * Either:
 *
 * 1. A JS `Array` of elements, or
 * 2. Something which implements both the `Iterable` interface, and the
 *    `ReversibleIterable` interface. - that is, it contains two iterators.
 */
export type IntoReversibleLazy<T> =
  | (ReversibleIterable<T> & Iterable<T>)
  | Array<T>;

export interface ReversibleIterable<T> {
  [R_ITER](): Iterator<T>;
}

/** Determines whether an iterable is compatible with `IntoReversibleLazy` */
export function isIntoReversibleLazy<T>(
  val: Iterable<T>,
): val is IntoReversibleLazy<T> {
  return isReversibleLazy(val) || Array.isArray(val);
}

/** Determines whether an iterable is a `ReversibleLazyIterable`. */
export function isReversibleLazy<T>(
  val: Iterable<T>,
): val is ReversibleLazyIterable<T> {
  return isLazy(val) && R_LAZY in val && val[R_LAZY] === true;
}

/**
 * A lazily evaluated iterable, which is lazily reversable.
 *
 * This is the core type for the _jslazy_ library, along with `LazyIterable`.
 * The library will return a `ReversibleLazyIterable` if possible.
 *
 * `ReversibleLazyIterables`, as their name suggests, are lazily evaluated, and
 * must be _consumed_ in order to perform work.
 */
export interface ReversibleLazyIterable<T>
  extends ReversibleIterable<T>,
    LazyIterable<T> {
  filter(predicate: Predicate<T>): ReversibleLazyIterable<T>;

  map<V>(mapper: Mapper<T, V>): ReversibleLazyIterable<V>;

  flatMap<V, MapperIter extends Iterable<V>>(
    mapper: Mapper<T, MapperIter>,
  ): MapperIter extends IntoReversibleLazy<V>
    ? ReversibleLazyIterable<V>
    : LazyIterable<V>;

  do(action: Action<T>): ReversibleLazyIterable<T>;

  collect(): Array<T>;

  limit(nValues: number): ReversibleLazyIterable<T>;

  takeWhile(predicate: Predicate<T>): ReversibleLazyIterable<T>;

  /**
   * Reverses the iterable
   *
   * This is non-mutating, and lazy.
   */
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
  const forwardNext = func(lazy[Symbol.iterator](), Symbol.iterator);
  if (isReversibleLazy(lazy)) {
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
    return lazyIterable({
      [Symbol.iterator]() {
        return { next: forwardNext };
      },
    }) as OutIterable;
  }
}
