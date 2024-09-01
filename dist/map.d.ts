export type Mapper<T, R> = (value: T) => R;
export declare function lazyMap<InItem, OutItem>(iterable: Iterable<InItem>, mapper: Mapper<InItem, OutItem>): Iterable<OutItem>;
