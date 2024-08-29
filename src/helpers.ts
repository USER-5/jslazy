import { lazy, type ReversibleLazy } from "./array";
import { R_ITER } from "./iter";

export function simpleHelper<T, R>(
  lazyArray: ReversibleLazy<T>,
  callback: (val: T) => AccessorResult<R>,
): ReversibleLazy<R> {
  return forwardReverseHelper(lazyArray, (iterator, _) => {
    return cloneAccessor(iterator, callback);
  });
}

/** Applies the provided function to both forward and reverse iterators */
export function forwardReverseHelper<T, V>(
  lazyArray: ReversibleLazy<T>,
  func: (
    it: Iterator<T>,
    iteratorProp: typeof R_ITER | typeof Symbol.iterator,
  ) => () => IteratorResult<V>,
): ReversibleLazy<V> {
  const forwardNext = func(lazyArray[Symbol.iterator](), Symbol.iterator);
  const reverseNext = func(lazyArray[R_ITER](), R_ITER);
  return lazy({
    [Symbol.iterator]() {
      return { next: forwardNext };
    },
    [R_ITER]() {
      return { next: reverseNext };
    },
  });
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
