import { type Predicate } from "./index";
export declare function lazyAll<Item>(lazyIterable: Iterable<Item>, predicate: Predicate<Item>): boolean;
