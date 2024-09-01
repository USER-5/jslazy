export function* lazyLimit<Item>(
  iterable: Iterable<Item>,
  nValues: number,
): Iterable<Item> {
  let nSeen = 0;
  if (nValues === 0) {
    return;
  }
  for (const value of iterable) {
    yield value;
    nSeen++;
    if (nSeen >= nValues) {
      return;
    }
  }
}
