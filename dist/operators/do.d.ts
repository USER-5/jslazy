export type Action<Item> = (value: Item) => void;
export declare function lazyDoGen<InItem>(iterable: Iterable<InItem>, action: Action<InItem>): Iterable<InItem>;
