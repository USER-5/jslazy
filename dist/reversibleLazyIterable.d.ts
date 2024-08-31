import type { Action } from "./do";
import type { Predicate } from "./filter";
import { type LazyIterable } from "./lazyIterable";
import type { Mapper } from "./map";
declare const R_ITER: unique symbol;
declare const R_LAZY: unique symbol;
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
export declare function isIntoReversibleLazy<T>(
  val: Iterable<T>,
): val is IntoReversibleLazy<T>;
/** Determines whether an iterable is a `ReversibleLazyIterable`. */
export declare function isReversibleLazy<T>(
  val: Iterable<T>,
): val is ReversibleLazyIterable<T>;
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
export declare function rLazyIterable<T>(
  source: IntoReversibleLazy<T>,
): ReversibleLazyIterable<T>;
/**
 * Applies the provided function to both forward and reverse iterators
 *
 * @param lazy The lazy array to operate on
 * @param func A function that takes 1 or 2 parameters
 */
export declare function reverseHelper<
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
): OutIterable;
export {};
