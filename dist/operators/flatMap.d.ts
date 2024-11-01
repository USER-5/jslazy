import type { Mapper } from "./map.js";
export declare function lazyFlatMapGen<InItem, OutItem>(iterable: Iterable<InItem>, mapper: Mapper<InItem, Iterable<OutItem>>, reverse: boolean): Iterable<OutItem>;
