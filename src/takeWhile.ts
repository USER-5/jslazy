import { simpleHelper } from "./helpers.js";
import type { ForwardLazyIterable, Predicate } from "./index.js";

export function lazyTakeWhile<Item, Iter extends ForwardLazyIterable<Item>>(
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
