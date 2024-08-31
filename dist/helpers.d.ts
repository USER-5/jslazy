import type { ForwardLazyIterable, LazyIterable } from "./index";
/** A simple helper, useful for implementing basic operators */
export declare function simpleHelper<InItem, OutItem, InIterable extends ForwardLazyIterable<InItem>, OutIterable = InIterable extends LazyIterable<InItem> ? LazyIterable<OutItem> : ForwardLazyIterable<OutItem>>(lazyArray: InIterable, callback: (val: InItem) => AccessorResult<OutItem>): OutIterable;
export type AccessorResult<T> = {
    filter?: boolean;
    item: IteratorResult<T>;
};
/**
 * Given an iterator, users can define a callback that returns an
 * `AccessorResult`.
 *
 * This can be used to filter and map values.
 */
export declare function cloneAccessor<InItem, OutItem, Iter extends Iterator<InItem>>(iterator: Iter, callback: (val: InItem) => AccessorResult<OutItem>): () => IteratorResult<OutItem>;
