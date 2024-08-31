import { simpleHelper } from "./helpers";
import type { LazyIterable } from "./index";

export type Action<Item> = (value: Item) => void;

export function lazyDo<InItem, Iterable extends LazyIterable<InItem>>(
  lazyArray: Iterable,
  action: Action<InItem>,
): Iterable {
  return simpleHelper<InItem, InItem, Iterable, Iterable>(lazyArray, (val) => {
    action(val);
    return {
      item: {
        done: false,
        value: val,
      },
    };
  });
}
