export type Action<Item> = (value: Item) => void;

export function* lazyDoGen<InItem>(
  iterable: Iterable<InItem>,
  action: Action<InItem>,
): Iterable<InItem> {
  for (const value of iterable) {
    action(value);
    yield value;
  }
}
