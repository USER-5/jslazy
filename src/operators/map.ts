export type Mapper<T, R> = (value: T) => R;

export function* lazyMapGen<InItem, OutItem>(
  iterable: Iterable<InItem>,
  mapper: Mapper<InItem, OutItem>,
): Iterable<OutItem> {
  for (const value of iterable) {
    yield mapper(value);
  }
}
