import { simpleHelper } from "./helpers.js";
import type { ForwardLazyIterable } from "./index.js";

export type Predicate<T> = (value: T) => boolean;

export function lazyFilter<Item, Iterable extends ForwardLazyIterable<Item>>(
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
