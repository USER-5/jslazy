import type { Predicate } from "../index.js";

export function lazyAny<Item>(
  iterable: Iterable<Item>,
  predicate: Predicate<Item>,
): boolean {
  for (const item of iterable) {
    if (predicate(item)) {
      // early terminate
      return true;
    }
  }
  return false;
}
