import type { ReversibleLazy } from "./array";
import { forwardReverseHelper } from "./helpers";

export function lazyLimit<T>(
  lazyIterator: ReversibleLazy<T>,
  nValues: number,
): ReversibleLazy<T> {
  let nSeen = 0;
  return forwardReverseHelper(lazyIterator, (iterator) => {
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
}
