import { simpleHelper } from "./helpers";
import type { LazyIterable, ReversibleLazyIterable } from "./index";

export type Mapper<T, R> = (value: T) => R;

export function lazyMap<
  InItem,
  OutItem,
  InIterable extends LazyIterable<InItem>,
  OutIterable = InIterable extends ReversibleLazyIterable<InItem>
    ? ReversibleLazyIterable<OutItem>
    : LazyIterable<OutItem>,
>(lazyArray: InIterable, mapper: Mapper<InItem, OutItem>): OutIterable {
  return simpleHelper<InItem, OutItem, InIterable, OutIterable>(
    lazyArray,
    (val) => ({
      item: {
        done: false,
        value: mapper(val),
      },
    }),
  );
}
