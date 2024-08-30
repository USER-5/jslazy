import type { LazyIterable } from "./lazyIterable";
import type { ReversibleLazyIterable } from "./reversibleLazyIterable";
export type Mapper<T, R> = (value: T) => R;
export declare function lazyMap<InItem, OutItem, InIterable extends LazyIterable<InItem>, OutIterable = InIterable extends ReversibleLazyIterable<InItem> ? ReversibleLazyIterable<OutItem> : LazyIterable<OutItem>>(lazyArray: InIterable, mapper: Mapper<InItem, OutItem>): OutIterable;
