const reverseIterator: unique symbol = Symbol();

export type Mapper<T, R> = (value: T) => R;

export type Action<T> = (value: T) => void;

export type Predicate<T> = (value: T) => boolean;

type AccessorResult<T> = {
  filter?: boolean;
  item: IteratorResult<T>;
};

interface ReversibleIterable<T> {
  [reverseIterator](): Iterator<T>;
}

export interface LazyArray<T> extends Iterable<T>, ReversibleIterable<T> {
  /** Filters out items which return 'false' when entered into the predicate */
  filter: (predicate: Predicate<T>) => LazyArray<T>;
  /** Maps each value into a different value */
  map: <V>(mapper: Mapper<T, V>) => LazyArray<V>;
  /**
   * Runs the provided action on each item when the item is processed.
   *
   * Note that since this is lazy, the items will need to be "pulled through"
   * the iterator.
   */
  do: (action: Action<T>) => LazyArray<T>;
  /** Collects the current array into a standard array */
  collect: () => Array<T>;
  /** Reverses the current lazy array. */
  reverse: () => LazyArray<T>;
}

/**
 * Creates a lazy array from a standard array.
 *
 * This is still in early development, and is subject to change.
 */
export function la<T>(
  source: (Iterable<T> & ReversibleIterable<T>) | Array<T>,
): LazyArray<T> {
  return {
    [Symbol.iterator]() {
      return {
        next: Array.isArray(source)
          ? arrayToIterator(source)
          : source[Symbol.iterator]().next,
      };
    },
    [reverseIterator]() {
      return {
        next: Array.isArray(source)
          ? arrayToReverseIterator(source)
          : source[reverseIterator]().next,
      };
    },

    filter(filterFunction) {
      return operatorHelper<T, T>(this, (val) => ({
        filter: filterFunction(val),
        item: {
          done: false,
          value: val,
        },
      }));
    },

    do(action) {
      return operatorHelper<T, T>(this, (val) => {
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
      return operatorHelper<T, R>(this, (val) => ({
        item: {
          done: false,
          value: mapper(val),
        },
      }));
    },

    reverse() {
      return la({
        [Symbol.iterator]: this[reverseIterator],
        [reverseIterator]: this[Symbol.iterator],
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

function operatorHelper<T, R>(
  lazyArray: LazyArray<T>,
  callback: (val: T) => AccessorResult<R>,
): LazyArray<R> {
  lazyArray[Symbol.iterator];
  const forwardNext = cloneAccessor(lazyArray[Symbol.iterator](), callback);
  const reverseNext = cloneAccessor(lazyArray[reverseIterator](), callback);
  return la({
    [Symbol.iterator]() {
      return { next: forwardNext };
    },
    [reverseIterator]() {
      return { next: reverseNext };
    },
  });
}

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
