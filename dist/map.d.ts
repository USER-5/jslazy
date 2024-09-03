export type Mapper<T, R> = (value: T) => R;
export declare function lazyMapGen<InItem, OutItem>(iterable: Iterable<InItem>, mapper: Mapper<InItem, OutItem>): Iterable<OutItem>;
