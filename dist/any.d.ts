import type { Predicate } from "./index.js";
export declare function lazyAny<Item>(lazyIterable: Iterable<Item>, predicate: Predicate<Item>): boolean;
