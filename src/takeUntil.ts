import type { Predicate } from "./index.js";
import { lazyTakeWhile } from "./takeWhile.js";

export function lazyTakeUntil<Item>(
  iterable: Iterable<Item>,
  predicate: Predicate<Item>,
): Iterable<Item> {
  // Just invert the predicate and use takeWhile
  return lazyTakeWhile(iterable, (v) => !predicate(v));
}
