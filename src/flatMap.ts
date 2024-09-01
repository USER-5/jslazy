import { isLazy, lazy } from "./index.js";
import { isIntoLazy } from "./lazyIterable.js";
import type { Mapper } from "./map.js";

export function* lazyFlatMap<InItem, OutItem>(
  iterable: Iterable<InItem>,
  mapper: Mapper<InItem, Iterable<OutItem>>,
  reverse: boolean,
): Iterable<OutItem> {
  for (const parentItem of iterable) {
    let childIterable = mapper(parentItem);
    if (reverse) {
      if (isIntoLazy(childIterable)) {
        childIterable = lazy(childIterable).reverse();
      } else {
        // Asked to reverse the parent, but the child wasn't reversible.
        throw "jslazy/FlatMap: Cannot Reverse Child Iterable.\nFlatMap received a non-reversible child iterable and then tried to reverse it";
      }
    }
    for (const item of mapper(parentItem)) {
      yield item;
    }
  }
}
