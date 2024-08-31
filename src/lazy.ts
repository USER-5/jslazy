import { lazyIterable } from "./forwardLazyIterable";
import type {
  LazyIterable,
  IntoReversibleLazy,
  ReversibleLazyIterable,
} from "./index";
import { isIntoReversibleLazy, rLazyIterable } from "./lazyIterable";

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
export function lazy<Items>(
  source: IntoReversibleLazy<Items>,
): ReversibleLazyIterable<Items>;
export function lazy<Items>(source: Iterable<Items>): LazyIterable<Items>;
export function lazy<Items>(source: Iterable<Items>): LazyIterable<Items> {
  if (isIntoReversibleLazy(source)) {
    return rLazyIterable(source);
  } else {
    return lazyIterable(source);
  }
}
