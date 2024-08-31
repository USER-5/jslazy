import { simpleHelper } from "./helpers";
import type { ForwardLazyIterable, LazyIterable } from "./index";

export type Mapper<T, R> = (value: T) => R;

export function lazyMap<
  InItem,
  OutItem,
  InIterable extends ForwardLazyIterable<InItem>,
  OutIterable = InIterable extends LazyIterable<InItem>
    ? LazyIterable<OutItem>
    : ForwardLazyIterable<OutItem>,
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
