import { type ForwardLazyIterable } from "./index";
import type { Mapper } from "./map";
import { type IntoLazy, type LazyIterable } from "./lazyIterable";
export declare function lazyFlatMap<InItem, OutItem, InIterable extends ForwardLazyIterable<InItem>, MapperIterable extends Iterable<OutItem>, OutIterable = InIterable extends LazyIterable<InItem> ? MapperIterable extends IntoLazy<OutItem> ? LazyIterable<OutItem> : ForwardLazyIterable<OutItem> : ForwardLazyIterable<OutItem>>(lazyArray: InIterable, fn: Mapper<InItem, MapperIterable>): OutIterable;
