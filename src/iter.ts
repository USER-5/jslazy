import type { IntoReversibleLazy, ReversibleLazy } from "./array";

export const R_ITER: unique symbol = Symbol();
export const R_LAZY: unique symbol = Symbol();

export interface ReversibleIterable<T> {
  [R_ITER](): Iterator<T>;
}

export type AccessorResult<T> = {
  filter?: boolean;
  item: IteratorResult<T>;
};

export function isReversibleLazy<T>(
  val: IntoReversibleLazy<T>,
): val is ReversibleLazy<T> {
  return R_LAZY in val && val[R_LAZY] === true;
}

/**
 * Given an iterator, users can define a callback that returns an
 * `AccessorResult`.
 *
 * This can be used to filter and map values.
 */
export function cloneAccessor<T, R>(
  iterator: Iterator<T>,
  callback: (val: T) => AccessorResult<R>,
): () => IteratorResult<R> {
  const next: () => IteratorResult<R> = () => {
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
