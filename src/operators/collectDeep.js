/**
 * @template Item
 * @typedef {Item extends Iterable<infer InItem>
 *     ? InItem extends Iterable
 *       ? RootItem<InItem>
 *       : InItem
 *     : Item} RootItem<Item>
 */

function isIterable(val) {
  return typeof val === "object" && val != null && Symbol.iterator in val;
}

/**
 * @template Item
 * @param {Iterable<Item>} iterable
 * @returns {RootItem<Item>[]}
 */
export function collectDeep(iterable) {
  return Array.from(iterable).map((item) => {
    if (isIterable(item)) {
      return collectDeep(item);
    } else {
      return item;
    }
  });
}
