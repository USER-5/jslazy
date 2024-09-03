import type { Predicate } from "./index.js";
export declare function lazyTakeWhileGen<Item>(iterable: Iterable<Item>, predicate: Predicate<Item>): Iterable<Item>;
