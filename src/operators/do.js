/**
 * @template Item
 * @param {Iterable<Item>} iterable
 * @param {function(Item): void} action
 * @yields {Item}
 * @generator
 */
export function* lazyDoGen(iterable, action) {
  for (const value of iterable) {
    action(value);
    yield value;
  }
}
