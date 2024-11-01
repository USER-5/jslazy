/**
 * @template Item
 * @param {Iterable<Item>} iterable
 * @param {function(Item): boolean} predicate
 * @yields {Item}
 * @generator
 */
export function* lazyFilterGen(iterable, predicate) {
  for (const value of iterable) {
    if (predicate(value)) {
      yield value;
    }
  }
}
