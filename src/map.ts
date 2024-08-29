import type { ReversibleLazy } from "./array";
import { simpleHelper } from "./helpers";

export type Mapper<T, R> = (value: T) => R;

export function lazyMap<T, R>(
  lazyArray: ReversibleLazy<T>,
  mapper: Mapper<T, R>,
): ReversibleLazy<R> {
  return simpleHelper(lazyArray, (val) => ({
    item: {
      done: false,
      value: mapper(val),
    },
  }));
}
