import type { ReversibleLazy } from "./array";
import { simpleHelper } from "./helpers";

export type Predicate<T> = (value: T) => boolean;

export function lazyFilter<T>(
  lazyIterable: ReversibleLazy<T>,
  filterFunction: Predicate<T>,
) {
  return simpleHelper<T, T>(lazyIterable, (val) => ({
    filter: filterFunction(val),
    item: {
      done: false,
      value: val,
    },
  }));
}
