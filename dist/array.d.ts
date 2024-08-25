declare const reverseIterator: unique symbol;
export type Mapper<T, R> = (value: T) => R;
export type Action<T> = (value: T) => void;
export type Predicate<T> = (value: T) => boolean;
interface ReversibleIterable<T> {
    [reverseIterator](): Iterator<T>;
}
export interface LazyArray<T> extends Iterable<T>, ReversibleIterable<T> {
    /** Filters out items which return 'false' when entered into the predicate */
    filter: (predicate: Predicate<T>) => LazyArray<T>;
    /** Maps each value into a different value */
    map: <V>(mapper: Mapper<T, V>) => LazyArray<V>;
    /** Flattens each item of the contained lazy arrays */
    flatMap: <V>(mapper: Mapper<T, LazyArray<V>>) => LazyArray<V>;
    /**
     * Runs the provided action on each item when the item is processed.
     *
     * Note that since this is lazy, the items will need to be "pulled through"
     * the iterator.
     */
    do: (action: Action<T>) => LazyArray<T>;
    /** Collects the current array into a standard array */
    collect: () => Array<T>;
    /** Reverses the current lazy array. */
    reverse: () => LazyArray<T>;
}
/**
 * Creates a lazy array from a standard array.
 *
 * This is still in early development, and is subject to change.
 */
export declare function la<T>(source: (Iterable<T> & ReversibleIterable<T>) | Array<T>): LazyArray<T>;
export {};
