import type { ForwardLazyIterable, Predicate } from "./index.js";
import { lazyTakeWhile } from "./takeWhile.js";

export function lazyTakeUntil<Item, Iter extends ForwardLazyIterable<Item>>(
  lazyIterable: Iter,
  predicate: Predicate<Item>,
): Iter {
  // Just invert the predicate and use takeWhile
  return lazyTakeWhile<Item, Iter>(lazyIterable, (v) => !predicate(v));
}
