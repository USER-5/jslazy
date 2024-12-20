import type { Predicate } from "../index.js";

export function* lazyTakeWhileGen<Item>(
  iterable: Iterable<Item>,
  predicate: Predicate<Item>,
): Iterable<Item> {
  for (const item of iterable) {
    if (!predicate(item)) {
      return;
    }
    yield item;
  }
}
