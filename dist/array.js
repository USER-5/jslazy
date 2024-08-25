"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Creates a lazy array from a standard array.
 *
 * This is still in early development, and is subject to change.
 */
function la(source) {
  return {
    [Symbol.iterator]() {
      return {
        next: Array.isArray(source)
          ? arrayToIterator(source)
          : source[Symbol.iterator]().next,
      };
    },
    filter(filterFunction) {
      return cloneAccessor(this, (val) => ({
        filter: filterFunction(val),
        item: {
          done: false,
          value: val,
        },
      }));
    },
    do(action) {
      return cloneAccessor(this, (val) => {
        action(val);
        return {
          item: {
            done: false,
            value: val,
          },
        };
      });
    },
    map(mapper) {
      return cloneAccessor(this, (val) => ({
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
function arrayToIterator(arr) {
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
function cloneAccessor(lazyArray, callback) {
  // Clone the parent at creation time
  const parentIterable = lazyArray[Symbol.iterator]();
  const next = () => {
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
module.exports = {
  la,
};
//# sourceMappingURL=array.js.map
