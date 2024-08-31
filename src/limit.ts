import type { ForwardLazyIterable } from "./index";
import { reverseHelper } from "./lazyIterable";

export function lazyLimit<Item, Iterable extends ForwardLazyIterable<Item>>(
  lazyIterator: Iterable,
  nValues: number,
): Iterable {
  let nSeen = 0;
  return reverseHelper(lazyIterator, (iterator) => {
    return () => {
      if (nSeen < nValues) {
        nSeen += 1;
        return iterator.next();
      } else {
        return {
          done: true,
          value: undefined,
        };
      }
    };
  });
}
