export type Predicate<T> = (value: T) => boolean;
export declare function lazyFilter<Item>(iterable: Iterable<Item>, predicate: Predicate<Item>): Iterable<Item>;
