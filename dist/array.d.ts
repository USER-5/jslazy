declare const R_ITER: unique symbol;
export type Mapper<T, R> = (value: T) => R;
export type Action<T> = (value: T) => void;
export type Predicate<T> = (value: T) => boolean;
interface ReversibleIterable<T> {
    [R_ITER](): Iterator<T>;
}
export interface ReversibleLazy<T> extends Iterable<T>, ReversibleIterable<T> {
    /** Filters out items which return 'false' when entered into the predicate */
    filter: (predicate: Predicate<T>) => ReversibleLazy<T>;
    /** Maps each value into a different value */
    map: <V>(mapper: Mapper<T, V>) => ReversibleLazy<V>;
    /** Flattens each item of the contained lazy arrays */
    flatMap: <V>(mapper: Mapper<T, ReversibleLazy<V>>) => ReversibleLazy<V>;
    /**
     * Runs the provided action on each item when the item is processed.
     *
     * Note that since this is lazy, the items will need to be "pulled through"
     * the iterator.
     */
    do: (action: Action<T>) => ReversibleLazy<T>;
    /** Collects the current array into a standard array */
    collect: () => Array<T>;
    /**
     * Limits the number of values to _at most_ `nValues`. If the array ends
     * before reaching `nValues`, then this operator has no effect.
     */
    limit: (nValues: number) => ReversibleLazy<T>;
    /** Reverses the current lazy array. */
    reverse: () => ReversibleLazy<T>;
}
/**
 * Creates a lazy array from a standard array.
 *
 * This is still in early development, and is subject to change.
 */
export declare function lazy<T>(source: (Iterable<T> & ReversibleIterable<T>) | Array<T>): ReversibleLazy<T>;
export {};
