import { type LazyIterable } from "./lazyIterable";
import { type IntoReversibleLazy, type ReversibleLazyIterable } from "./reversibleLazyIterable";
/**
 * Construct a lazy iterable from an existing iterable
 *
 * If possible, this will return a `ReversibleLazyIterable`, which allows for
 * lazy reversing.
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
export declare function lazy<Items>(source: IntoReversibleLazy<Items>): ReversibleLazyIterable<Items>;
export declare function lazy<Items>(source: Iterable<Items>): LazyIterable<Items>;
