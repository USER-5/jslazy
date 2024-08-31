import type { ForwardLazyIterable, LazyIterable } from "./index";
import { reverseHelper } from "./lazyIterable";

/** A simple helper, useful for implementing basic operators */
export function simpleHelper<
  InItem,
  OutItem,
  InIterable extends ForwardLazyIterable<InItem>,
  OutIterable = InIterable extends LazyIterable<InItem>
    ? LazyIterable<OutItem>
    : ForwardLazyIterable<OutItem>,
>(
  lazyArray: InIterable,
  callback: (val: InItem) => AccessorResult<OutItem>,
): OutIterable {
  return reverseHelper<InItem, OutItem, InIterable, OutIterable>(
    lazyArray,
    (iterator, _) => {
      return cloneAccessor(iterator, callback);
    },
  );
}

export type AccessorResult<T> = {
  filter?: boolean;
  item: IteratorResult<T>;
};

/**
 * Given an iterator, users can define a callback that returns an
 * `AccessorResult`.
 *
 * This can be used to filter and map values.
 */
export function cloneAccessor<InItem, OutItem, Iter extends Iterator<InItem>>(
  iterator: Iter,
  callback: (val: InItem) => AccessorResult<OutItem>,
): () => IteratorResult<OutItem> {
  const next: () => IteratorResult<OutItem> = () => {
    // Consume the parent at consumption time
    while (true) {
      const parentNext = iterator.next();
      if (parentNext.done === true) {
        return parentNext;
      }
      const callbackVal = callback(parentNext.value);
      // If filter is defined, and false, then the item is omitted
      if (callbackVal.filter === undefined || callbackVal.filter === true) {
        return callbackVal.item;
      }
    }
  };

  return next;
}
