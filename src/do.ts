import { simpleHelper } from "./helpers.js";
import type { ForwardLazyIterable } from "./index.js";

export type Action<Item> = (value: Item) => void;

export function lazyDo<InItem, Iterable extends ForwardLazyIterable<InItem>>(
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
