import { lazy, type ForwardLazyIterable, type LazyIterable } from "./index.js";

export type Mapper<T, R> = (value: T) => R;

function* generateWindows<T>(
  parent: Iterator<T>,
  windowSize: number,
): Iterator<LazyIterable<T>> {
  let seenItems = [];
  while (seenItems.length < windowSize) {
    const nextItem = parent.next();
    if (nextItem.done) {
      return;
    }
    seenItems.push(nextItem.value);
  }

  while (true) {
    yield lazy(seenItems);
    const nextItem = parent.next();
    if (nextItem.done) {
      return;
    }
    seenItems = [...seenItems];
    seenItems.push(nextItem.value);
    seenItems.splice(0, 1);
  }
}

export function lazyWindow<Item, Iter extends ForwardLazyIterable<Item>>(
  lazyArray: Iter,
  windowSize: number,
): Iter extends LazyIterable<Item>
  ? LazyIterable<LazyIterable<Item>>
  : ForwardLazyIterable<LazyIterable<Item>> {
  const windowsIterable = {
    [Symbol.iterator]() {
      return generateWindows(lazyArray[Symbol.iterator](), windowSize);
    },
  };
  return lazy(windowsIterable) as any;
}
