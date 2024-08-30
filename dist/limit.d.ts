import type { LazyIterable } from "./lazyIterable";
export declare function lazyLimit<Item, Iterable extends LazyIterable<Item>>(lazyIterator: Iterable, nValues: number): Iterable;
