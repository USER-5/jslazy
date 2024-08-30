import type { Predicate } from "./filter";
import type { LazyIterable } from "./lazyIterable";
import { lazyTakeWhile } from "./takeWhile";

export function lazyTakeUntil<Item, Iter extends LazyIterable<Item>>(
  lazyIterable: Iter,
  predicate: Predicate<Item>,
): Iter {
  // Just invert the predicate and use takeWhile
  return lazyTakeWhile<Item, Iter>(lazyIterable, (v) => !predicate(v));
}
