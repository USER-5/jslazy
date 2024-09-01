export type CollectDeep<T> =
  T extends Array<unknown>
    ? T
    : T extends Iterable<infer ItItem>
      ? Array<CollectDeep<ItItem>>
      : T;

function isIterable(val: unknown): val is Iterable<unknown> {
  return typeof val === "object" && val != null && Symbol.iterator in val;
}

export function collectDeep<T>(iterable: Iterable<T>): CollectDeep<T> {
  return Array.from(iterable).map((item) => {
    if (isIterable(item)) {
      return collectDeep(item);
    } else {
      return item;
    }
  }) as any;
}
