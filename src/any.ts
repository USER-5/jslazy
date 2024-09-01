import type { Predicate } from "./index.js";

export function lazyAny<Item>(
  lazyIterable: Iterable<Item>,
  predicate: Predicate<Item>,
): boolean {
  for (const item of lazyIterable) {
    if (predicate(item)) {
      // early terminate
      return true;
    }
  }
  return false;
}
