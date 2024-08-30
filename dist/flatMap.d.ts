import { type LazyIterable } from "./lazyIterable";
import type { Mapper } from "./map";
import { type IntoReversibleLazy, type ReversibleLazyIterable } from "./reversibleLazyIterable";
export declare function lazyFlatMap<InItem, OutItem, InIterable extends LazyIterable<InItem>, MapperIterable extends Iterable<OutItem>, OutIterable = InIterable extends ReversibleLazyIterable<InItem> ? MapperIterable extends IntoReversibleLazy<OutItem> ? ReversibleLazyIterable<OutItem> : LazyIterable<OutItem> : LazyIterable<OutItem>>(lazyArray: InIterable, fn: Mapper<InItem, MapperIterable>): OutIterable;
