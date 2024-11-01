import { lazy } from "../index.js";
import type { Mapper } from "./map.js";

export function* lazyFlatMapGen<InItem, OutItem>(
  iterable: Iterable<InItem>,
  mapper: Mapper<InItem, Iterable<OutItem>>,
  reverse: boolean,
): Iterable<OutItem> {
  for (const parentItem of iterable) {
    let childIterable = mapper(parentItem);
    if (reverse) {
      childIterable = lazy(childIterable).reverse();
    }
    for (const item of mapper(parentItem)) {
      yield item;
    }
  }
}
