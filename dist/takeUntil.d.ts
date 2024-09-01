import type { Predicate } from "./index.js";
export declare function lazyTakeUntil<Item>(iterable: Iterable<Item>, predicate: Predicate<Item>): Iterable<Item>;
