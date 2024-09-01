import { type Predicate } from "./index.js";
export declare function lazyAll<Item>(lazyIterable: Iterable<Item>, predicate: Predicate<Item>): boolean;
