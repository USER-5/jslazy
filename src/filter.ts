import { simpleHelper } from "./helpers";
import type { LazyIterable } from "./lazyIterable";

export type Predicate<T> = (value: T) => boolean;

export function lazyFilter<Item, Iterable extends LazyIterable<Item>>(
  lazyIterable: Iterable,
  filterFunction: Predicate<Item>,
): Iterable {
  return simpleHelper<Item, Item, Iterable, Iterable>(lazyIterable, (val) => ({
    filter: filterFunction(val),
    item: {
      done: false,
      value: val,
    },
  }));
}
