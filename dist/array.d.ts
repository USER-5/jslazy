export type Mapper<T, R> = (value: T) => R;
export type Action<T> = (value: T) => void;
export type Predicate<T> = (value: T) => boolean;
export interface LazyArray<T> extends Iterable<T> {
  /** Filters out items which return 'false' when entered into the predicate */
  filter: (predicate: Predicate<T>) => LazyArray<T>;
  /** Maps each value into a different value */
  map: <V>(mapper: Mapper<T, V>) => LazyArray<V>;
  /**
   * Runs the provided action on each item when the item is processed.
   *
   * Note that since this is lazy, the items will need to be "pulled through"
   * the iterator.
   */
  do: (action: Action<T>) => LazyArray<T>;
  collect: () => Array<T>;
}
