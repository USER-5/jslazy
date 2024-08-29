import type { ReversibleLazy } from "./array";
import { simpleHelper } from "./helpers";

export type Action<T> = (value: T) => void;

export function lazyDo<T>(
  lazyArray: ReversibleLazy<T>,
  action: Action<T>,
): ReversibleLazy<T> {
  return simpleHelper(lazyArray, (val) => {
    action(val);
    return {
      item: {
        done: false,
        value: val,
      },
    };
  });
}
