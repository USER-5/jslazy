export function* lazyFlattenGen<Item>(
  iterable: Iterable<Iterable<Item>>,
): Iterable<Item> {
  for (const value of iterable) {
    for (const inner of value) {
      yield inner;
    }
  }
}
