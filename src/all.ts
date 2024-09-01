import { lazy, type Predicate } from "./index.js";

export function lazyAll<Item>(
  lazyIterable: Iterable<Item>,
  predicate: Predicate<Item>,
): boolean {
  // In boolean logic:
  //  a & b & c & ... === !(!a | !b | !c | ...)
  // So, we can just defer to `any` if we negate the predicate, and the result
  return !lazy(lazyIterable).any((v) => !predicate(v));
}
