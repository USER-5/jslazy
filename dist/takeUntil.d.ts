import type { ForwardLazyIterable, Predicate } from "./index.js";
export declare function lazyTakeUntil<Item, Iter extends ForwardLazyIterable<Item>>(lazyIterable: Iter, predicate: Predicate<Item>): Iter;
