export type Mapper<T, R> = (value: T) => R;

export type Action<T> = (value: T) => void;

export type Predicate<T> = (value: T) => boolean;

type AccessorResult<T> = {
  filter?: boolean;
  item: IteratorResult<T>;
};

export interface LazyArray<T> extends Iterable<T> {
  /** Filters out items which return 'false' when entered into the predicate */
  filter: (predicate: Predicate<T>) => LazyArray<T>;
  /** Maps each value into a different value */
  map: <V>(mapper: Mapper<T, V>) => LazyArray<V>;
  /**
   * Runs the provided action on each item when the item is processed.
   *
   * Note that since this is lazy, the items will need to be "pulled through" the iterator.
   */
  do: (action: Action<T>) => LazyArray<T>;
  collect: () => Array<T>;
}

/**
 * Creates a lazy array from a standard array.
 *
 * This is still in early development, and is subject to change.
 */
export function la<T>(source: Iterable<T> | Array<T>): LazyArray<T> {
  return {
    [Symbol.iterator]() {
      return {
        next: Array.isArray(source)
          ? arrayToIterator(source)
          : source[Symbol.iterator]().next,
      };
    },

    filter(filterFunction) {
      return cloneAccessor<T, T>(this, (val) => ({
        filter: filterFunction(val),
        item: {
          done: false,
          value: val,
        },
      }));
    },

    do(action) {
      return cloneAccessor<T, T>(this, (val) => {
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
      return cloneAccessor<T, R>(this, (val) => ({
        item: {
          done: false,
          value: mapper(val),
        },
      }));
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
      };
    } else {
      return {
        value: arr[index++],
        done: false,
      };
    }
  };
}

function cloneAccessor<T, R>(
  lazyArray: LazyArray<T>,
  callback: (val: T) => AccessorResult<R>,
): LazyArray<R> {
  // Clone the parent at creation time
  const parentIterable = lazyArray[Symbol.iterator]();

  const next: () => IteratorResult<R> = () => {
    // Consume the parent at consumption time
    while (true) {
      const parentNext = parentIterable.next();
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

  return la({
    [Symbol.iterator]() {
      return { next };
    },
  });
}
