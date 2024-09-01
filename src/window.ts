import { lazy, type LazyIterable } from "./index.js";

export type Mapper<T, R> = (value: T) => R;

export function* lazyWindows<T>(
  parent: Iterable<T>,
  windowSize: number,
): Iterable<LazyIterable<T>> {
  let seenItems = [];
  let iterator = parent[Symbol.iterator]();
  while (seenItems.length < windowSize) {
    const nextItem = iterator.next();
    if (nextItem.done) {
      return;
    }
    seenItems.push(nextItem.value);
  }

  while (true) {
    yield lazy(seenItems);
    const nextItem = iterator.next();
    if (nextItem.done) {
      return;
    }
    seenItems = [...seenItems];
    seenItems.push(nextItem.value);
    seenItems.splice(0, 1);
  }
}
