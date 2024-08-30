export const R_ITER = Symbol();
export const R_LAZY = Symbol();
export function isReversibleLazy(val) {
  return R_LAZY in val && val[R_LAZY] === true;
}
/**
 * Given an iterator, users can define a callback that returns an
 * `AccessorResult`.
 *
 * This can be used to filter and map values.
 */
export function cloneAccessor(iterator, callback) {
  const next = () => {
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
//# sourceMappingURL=iter.js.map
