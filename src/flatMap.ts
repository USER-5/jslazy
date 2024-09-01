import { isLazy } from "./index.js";
import type { Mapper } from "./map.js";

export function* lazyFlatMap<InItem, OutItem>(
  iterable: Iterable<InItem>,
  mapper: Mapper<InItem, Iterable<OutItem>>,
  reverse: boolean,
): Iterable<OutItem> {
  for (const parentItem of iterable) {
    let childIterable = mapper(parentItem);
    if (reverse) {
      if (isLazy(childIterable)) {
        childIterable = childIterable.reverse();
      } else {
        // Asked to reverse the parent, but the child wasn't reversible.
        throw "jslazy/FlatMap: Cannot Reverse Child Iterable.\nFlatMap received a non-reversible child iterable and then tried to reverse it";
      }
    }
    if (reverse && isLazy(childIterable)) {
    }
    for (const item of mapper(parentItem)) {
      yield item;
    }
  }
}
