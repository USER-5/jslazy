import type { ReversibleLazy } from "./array";
import { simpleHelper } from "./helpers";
import type { Predicate } from "./predicate";

export function lazyTakeWhile<T>(
  lazyIterable: ReversibleLazy<T>,
  predicate: Predicate<T>,
): ReversibleLazy<T> {
  return simpleHelper<T, T>(lazyIterable, (val) => {
    // If we fail, terminate the iterable
    if (!predicate(val)) {
      return {
        item: {
          done: true,
          value: undefined,
        },
      };
    }
    // Otherwise, pass-thru
    return {
      item: {
        done: false,
        value: val,
      },
    };
  });
}
