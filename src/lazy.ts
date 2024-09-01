import { forwardLazyIterable } from "./forwardLazyIterable.js";
import type { ForwardLazyIterable, IntoLazy, LazyIterable } from "./index.js";
import { isIntoLazy, rLazyIterable } from "./lazyIterable.js";

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
export function lazy<Items>(source: IntoLazy<Items>): LazyIterable<Items>;
export function lazy<Items>(
  source: Iterable<Items>,
): ForwardLazyIterable<Items>;
export function lazy<Items>(
  source: Iterable<Items>,
): ForwardLazyIterable<Items> {
  if (isIntoLazy(source)) {
    return rLazyIterable(source);
  } else {
    return forwardLazyIterable(source);
  }
}
