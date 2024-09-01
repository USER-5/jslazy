import type { Predicate } from "./index.js";
export declare function lazyTakeWhile<Item>(iterable: Iterable<Item>, predicate: Predicate<Item>): Iterable<Item>;
