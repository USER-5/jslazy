import type { ForwardLazyIterable, LazyIterable } from "./index.js";
export type Mapper<T, R> = (value: T) => R;
export declare function lazyMap<InItem, OutItem, InIterable extends ForwardLazyIterable<InItem>, OutIterable = InIterable extends LazyIterable<InItem> ? LazyIterable<OutItem> : ForwardLazyIterable<OutItem>>(lazyArray: InIterable, mapper: Mapper<InItem, OutItem>): OutIterable;
