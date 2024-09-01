export type Predicate<T> = (value: T) => boolean;

export function* lazyFilter<Item>(
  iterable: Iterable<Item>,
  predicate: Predicate<Item>,
): Iterable<Item> {
  for (const value of iterable) {
    if (predicate(value)) {
      yield value;
    }
  }
}
