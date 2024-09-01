import type { ForwardLazyIterable } from "./index.js";
export type Action<Item> = (value: Item) => void;
export declare function lazyDo<InItem, Iterable extends ForwardLazyIterable<InItem>>(lazyArray: Iterable, action: Action<InItem>): Iterable;
