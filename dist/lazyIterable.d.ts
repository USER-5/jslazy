import type { Action } from "./do";
import type { Predicate } from "./filter";
import { type ForwardLazyIterable } from "./index";
import type { Mapper } from "./map";
declare const R_ITER: unique symbol;
declare const LAZY_FLAG: unique symbol;
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
export declare function isIntoLazy<T>(val: Iterable<T>): val is IntoLazy<T>;
/** Determines whether an iterable is a `LazyIterable`. */
export declare function isLazy<T>(val: Iterable<T>): val is LazyIterable<T>;
/**
 * A lazily evaluated iterable, which is lazily reversable.
 *
 * This is the core type for the _jslazy_ library, along with
 * `ForwardLazyIterable`. The library will return a `LazyIterable` if possible.
 *
 * `LazyIterables`, as their name suggests, are lazily evaluated, and must be
 * _consumed_ in order to perform work.
 */
export interface LazyIterable<T> extends ReversibleIterable<T>, ForwardLazyIterable<T> {
    filter(predicate: Predicate<T>): LazyIterable<T>;
    map<V>(mapper: Mapper<T, V>): LazyIterable<V>;
    flatMap<V, MapperIter extends Iterable<V>>(mapper: Mapper<T, MapperIter>): MapperIter extends IntoLazy<V> ? LazyIterable<V> : ForwardLazyIterable<V>;
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
export declare function rLazyIterable<T>(source: IntoLazy<T>): LazyIterable<T>;
/**
 * Applies the provided function to both forward and reverse iterators
 *
 * @param lazy The lazy array to operate on
 * @param func A function that takes 1 or 2 parameters
 */
export declare function reverseHelper<InItem, OutItem, InIterable extends ForwardLazyIterable<InItem>, OutIterable = InIterable extends ForwardLazyIterable<InItem> ? ForwardLazyIterable<OutItem> : LazyIterable<OutItem>>(lazy: InIterable, func: (it: Iterator<InItem, any, undefined>, iteratorProp: typeof R_ITER | typeof Symbol.iterator) => () => IteratorResult<OutItem>): OutIterable;
export {};
