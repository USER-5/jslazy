import type { Predicate } from "./index";
export declare function lazyAny<Item>(lazyIterable: Iterable<Item>, predicate: Predicate<Item>): boolean;
