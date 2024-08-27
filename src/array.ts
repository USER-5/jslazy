const R_ITER: unique symbol = Symbol.for("REVERSE ITERATOR");

export type Mapper<T, R> = (value: T) => R;

export type Action<T> = (value: T) => void;

export type Predicate<T> = (value: T) => boolean;

interface ReversibleIterable<T> {
  [R_ITER](): Iterator<T>;
}

export interface ReversibleLazy<T> extends Iterable<T>, ReversibleIterable<T> {
  /** Filters out items which return 'false' when entered into the predicate */
  filter: (predicate: Predicate<T>) => ReversibleLazy<T>;
  /** Maps each value into a different value */
  map: <V>(mapper: Mapper<T, V>) => ReversibleLazy<V>;
  /** Flattens each item of the contained lazy arrays */
  flatMap: <V>(mapper: Mapper<T, ReversibleLazy<V>>) => ReversibleLazy<V>;
  /**
   * Runs the provided action on each item when the item is processed.
   *
   * Note that since this is lazy, the items will need to be "pulled through"
   * the iterator.
   */
  do: (action: Action<T>) => ReversibleLazy<T>;
  /** Collects the current array into a standard array */
  collect: () => Array<T>;
  /**
   * Limits the number of values to _at most_ `nValues`. If the array ends
   * before reaching `nValues`, then this operator has no effect.
   */
  limit: (nValues: number) => ReversibleLazy<T>;
  /** Reverses the current lazy array. */
  reverse: () => ReversibleLazy<T>;
}

/**
 * Creates a lazy array from a standard array.
 *
 * This is still in early development, and is subject to change.
 */
export function lazy<T>(
  source: (Iterable<T> & ReversibleIterable<T>) | Array<T>,
): ReversibleLazy<T> {
  return {
    [Symbol.iterator]() {
      return {
        next: Array.isArray(source)
          ? arrayToIterator(source)
          : source[Symbol.iterator]().next,
      };
    },
    [R_ITER]() {
      return {
        next: Array.isArray(source)
          ? arrayToReverseIterator(source)
          : source[R_ITER]().next,
      };
    },

    filter(filterFunction) {
      return simpleHelper<T, T>(this, (val) => ({
        filter: filterFunction(val),
        item: {
          done: false,
          value: val,
        },
      }));
    },

    do(action) {
      return simpleHelper<T, T>(this, (val) => {
        action(val);
        return {
          item: {
            done: false,
            value: val,
          },
        };
      });
    },

    map<R>(mapper: Mapper<T, R>) {
      return simpleHelper<T, R>(this, (val) => ({
        item: {
          done: false,
          value: mapper(val),
        },
      }));
    },

    flatMap<R>(mapper: Mapper<T, ReversibleLazy<R>>) {
      return forwardReverseHelper<T, R>(this, (iterator, prop) => {
        let subIterator: Iterator<R> | null = null;
        return () => {
          while (true) {
            // Get next subiterator
            if (!subIterator) {
              const subIteratorResult = iterator.next();
              if (subIteratorResult.done === false) {
                subIterator = mapper(subIteratorResult.value)[prop]();
              } else {
                return {
                  done: true,
                  value: undefined,
                } as any;
              }
            }
            const nextValue = subIterator.next();
            if (nextValue.done === true) {
              subIterator = null;
              continue;
            } else {
              return {
                done: false,
                value: nextValue.value,
              };
            }
          }
        };
      });
    },

    limit(nValues) {
      let nSeen = 0;
      return forwardReverseHelper(this, (iterator) => {
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
    },

    reverse() {
      return lazy({
        [Symbol.iterator]: this[R_ITER],
        [R_ITER]: this[Symbol.iterator],
      });
    },

    collect() {
      return Array.from(this);
    },
  };
}

function arrayToIterator<T>(arr: Array<T>): () => IteratorResult<T> {
  let index = 0;
  return () => {
    if (arr.length == index) {
      return {
        done: true,
        value: undefined,
      } as any;
    } else {
      return {
        value: arr[index++],
        done: false,
      };
    }
  };
}

function arrayToReverseIterator<T>(arr: Array<T>): () => IteratorResult<T> {
  let index = 0;
  return () => {
    if (arr.length == index) {
      return {
        done: true,
        value: undefined,
      } as any;
    } else {
      return {
        value: arr[arr.length - index++ - 1],
        done: false,
      };
    }
  };
}

function simpleHelper<T, R>(
  lazyArray: ReversibleLazy<T>,
  callback: (val: T) => AccessorResult<R>,
): ReversibleLazy<R> {
  return forwardReverseHelper(lazyArray, (iterator, _) => {
    return cloneAccessor(iterator, callback);
  });
}

/** Applies the provided function to both forward and reverse iterators */
function forwardReverseHelper<T, V>(
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

type AccessorResult<T> = {
  filter?: boolean;
  item: IteratorResult<T>;
};

function cloneAccessor<T, R>(
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
