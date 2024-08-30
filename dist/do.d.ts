import type { LazyIterable } from "./lazyIterable";
export type Action<Item> = (value: Item) => void;
export declare function lazyDo<InItem, Iterable extends LazyIterable<InItem>>(lazyArray: Iterable, action: Action<InItem>): Iterable;
