import { simpleHelper } from "./helpers";
import type { Predicate } from "./filter";
import type { LazyIterable } from "./lazyIterable";

export function lazyTakeWhile<Item, Iter extends LazyIterable<Item>>(
  lazyIterable: Iter,
  predicate: Predicate<Item>,
): Iter {
  return simpleHelper<Item, Item, Iter, Iter>(lazyIterable, (val) => {
    // If we fail, terminate the iterable
    if (!predicate(val)) {
      return {
        item: {
          done: true,
          value: undefined,
        },
      };
    }
    // Otherwise, pass-thru
    return {
      item: {
        done: false,
        value: val,
      },
    };
  });
}
