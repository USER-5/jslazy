import type { IntoReversibleLazy, ReversibleLazy } from "./array";
export declare const R_ITER: unique symbol;
export declare const R_LAZY: unique symbol;
export interface ReversibleIterable<T> {
    [R_ITER](): Iterator<T>;
}
export type AccessorResult<T> = {
    filter?: boolean;
    item: IteratorResult<T>;
};
export declare function isReversibleLazy<T>(val: IntoReversibleLazy<T>): val is ReversibleLazy<T>;
/**
 * Given an iterator, users can define a callback that returns an
 * `AccessorResult`.
 *
 * This can be used to filter and map values.
 */
export declare function cloneAccessor<T, R>(iterator: Iterator<T>, callback: (val: T) => AccessorResult<R>): () => IteratorResult<R>;
