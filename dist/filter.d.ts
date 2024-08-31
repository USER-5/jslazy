import type { ForwardLazyIterable } from "./index";
export type Predicate<T> = (value: T) => boolean;
export declare function lazyFilter<Item, Iterable extends ForwardLazyIterable<Item>>(lazyIterable: Iterable, filterFunction: Predicate<Item>): Iterable;
