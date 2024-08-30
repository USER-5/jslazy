import type { Predicate } from "./filter";
import type { LazyIterable } from "./lazyIterable";
export declare function lazyTakeUntil<Item, Iter extends LazyIterable<Item>>(lazyIterable: Iter, predicate: Predicate<Item>): Iter;
