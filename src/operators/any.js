/**
 * @template Item
 * @param {Iterable<Item>} iterable
 * @param {function(Item):boolean} predicate
 * @returns {boolean}
 */
export function lazyAny(iterable, predicate) {
  for (const item of iterable) {
    if (predicate(item)) {
      // early terminate
      return true;
    }
  }
  return false;
}
//# sourceMappingURL=any.js.map
