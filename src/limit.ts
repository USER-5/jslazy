import type { LazyIterable } from "./lazyIterable";
import { reverseHelper } from "./reversibleLazyIterable";

export function lazyLimit<Item, Iterable extends LazyIterable<Item>>(
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
