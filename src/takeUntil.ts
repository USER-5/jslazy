import type { Predicate } from "./index.js";
import { lazyTakeWhileGen } from "./takeWhile.js";

export function* lazyTakeUntilGen<Item>(
  iterable: Iterable<Item>,
  predicate: Predicate<Item>,
): Iterable<Item> {
  // Just invert the predicate and use takeWhile
  yield* lazyTakeWhileGen(iterable, (v) => !predicate(v));
}
