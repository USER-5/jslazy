import { type ReversibleLazy } from "./array";
import { R_ITER } from "./iter";
export declare function simpleHelper<T, R>(lazyArray: ReversibleLazy<T>, callback: (val: T) => AccessorResult<R>): ReversibleLazy<R>;
/** Applies the provided function to both forward and reverse iterators */
export declare function forwardReverseHelper<T, V>(lazyArray: ReversibleLazy<T>, func: (it: Iterator<T>, iteratorProp: typeof R_ITER | typeof Symbol.iterator) => () => IteratorResult<V>): ReversibleLazy<V>;
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
export declare function cloneAccessor<T, R>(iterator: Iterator<T>, callback: (val: T) => AccessorResult<R>): () => IteratorResult<R>;
