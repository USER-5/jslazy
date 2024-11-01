import type { Predicate } from "../index.js";
export declare function lazyTakeUntilGen<Item>(iterable: Iterable<Item>, predicate: Predicate<Item>): Iterable<Item>;
