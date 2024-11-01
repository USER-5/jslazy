import { lazy } from "../index.js";

/**
 * @template Item
 * @param {Iterable<Item>} iterable
 * @param {function(Item):boolean} predicate
 * @returns {boolean}
 */
export function lazyAll(iterable, predicate) {
  // In boolean logic:
  //  a & b & c & ... === !(!a | !b | !c | ...)
  // So, we can just defer to `any` if we negate the predicate, and the result
  return !lazy(iterable).any((v) => !predicate(v));
}
