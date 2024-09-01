import type { ForwardLazyIterable } from "./index.js";
export declare function lazyLimit<Item, Iterable extends ForwardLazyIterable<Item>>(lazyIterator: Iterable, nValues: number): Iterable;
