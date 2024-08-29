import { type Action } from "./do";
import { type Predicate } from "./filter";
import { R_LAZY, type ReversibleIterable } from "./iter";
import { type Mapper } from "./map";
export type IntoReversibleLazy<T> = (ReversibleIterable<T> & Iterable<T>) | Array<T>;
export interface ReversibleLazy<T> extends Iterable<T>, ReversibleIterable<T> {
    /** Filters out items which return 'false' when entered into the predicate */
    filter(predicate: Predicate<T>): ReversibleLazy<T>;
    /** Maps each value into a different value */
    map<V>(mapper: Mapper<T, V>): ReversibleLazy<V>;
    /** Flattens each item of the contained lazy arrays */
    flatMap<V>(mapper: Mapper<T, IntoReversibleLazy<V>>): ReversibleLazy<V>;
    /**
     * Runs the provided action on each item when the item is processed.
     *
     * Note that since this is lazy, the items will need to be "pulled through"
     * the iterator.
     */
    do(action: Action<T>): ReversibleLazy<T>;
    /** Collects the current array into a standard array */
    collect(): Array<T>;
    /**
     * Limits the number of values to _at most_ `nValues`. If the array ends
     * before reaching `nValues`, then this operator has no effect.
     */
    limit(nValues: number): ReversibleLazy<T>;
    /** Reverses the current lazy array. */
    reverse(): ReversibleLazy<T>;
    readonly [R_LAZY]: true;
}
/**
 * Creates a reversible lazy array from the source.
 *
 * This is still in early development, and is subject to change.
 */
export declare function lazy<T>(source: IntoReversibleLazy<T>): ReversibleLazy<T>;
