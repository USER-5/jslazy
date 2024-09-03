export type Predicate<T> = (value: T) => boolean;
export declare function lazyFilterGen<Item>(iterable: Iterable<Item>, predicate: Predicate<Item>): Iterable<Item>;
