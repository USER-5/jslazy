import type { LazyIterable } from "./lazyIterable";
export type Predicate<T> = (value: T) => boolean;
export declare function lazyFilter<Item, Iterable extends LazyIterable<Item>>(lazyIterable: Iterable, filterFunction: Predicate<Item>): Iterable;
