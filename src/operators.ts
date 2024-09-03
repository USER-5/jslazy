import { lazyDoGen, type Action } from "./do.js";
import { lazyFilterGen, type Predicate } from "./filter.js";
import { lazyFlatMapGen } from "./flatMap.js";
import type { LazyIterable } from "./index.js";
import { lazyLimitGen } from "./limit.js";
import { lazyMapGen, type Mapper } from "./map.js";
import { lazyTakeUntilGen } from "./takeUntil.js";
import { lazyTakeWhileGen } from "./takeWhile.js";
import { lazyWindowsGen } from "./window.js";

export { lazyAny } from "./any.js";
export { lazyAll } from "./all.js";
export { collectDeep } from "./collectDeep.js";

function generatorToIterable<T>(iterable: Iterable<T>): Iterable<T> {
  return {
    [Symbol.iterator]() {
      return iterable[Symbol.iterator]();
    },
  };
}

export function lazyMap<T, V>(
  iterable: Iterable<T>,
  mappingFunction: Mapper<T, V>,
): Iterable<V> {
  return generatorToIterable(lazyMapGen(iterable, mappingFunction));
}

export function lazyFlatMap<T, V>(
  iterable: Iterable<T>,
  mappingFunction: Mapper<T, Iterable<V>>,
): Iterable<V> {
  return generatorToIterable(lazyFlatMapGen(iterable, mappingFunction, false));
}

export function lazyFilter<T>(
  iterable: Iterable<T>,
  predicate: Predicate<T>,
): Iterable<T> {
  return generatorToIterable(lazyFilterGen(iterable, predicate));
}

export function lazyDo<T>(
  iterable: Iterable<T>,
  action: Action<T>,
): Iterable<T> {
  return generatorToIterable(lazyDoGen(iterable, action));
}

export function lazyLimit<T>(
  iterable: Iterable<T>,
  nValues: number,
): Iterable<T> {
  return generatorToIterable(lazyLimitGen(iterable, nValues));
}

export function lazyTakeUntil<T>(
  iterable: Iterable<T>,
  predicate: Predicate<T>,
): Iterable<T> {
  return generatorToIterable(lazyTakeUntilGen(iterable, predicate));
}

export function lazyTakeWhile<T>(
  iterable: Iterable<T>,
  predicate: Predicate<T>,
): Iterable<T> {
  return generatorToIterable(lazyTakeWhileGen(iterable, predicate));
}

export function lazyWindows<T>(
  iterable: Iterable<T>,
  windowSize: number,
): Iterable<LazyIterable<T>> {
  return generatorToIterable(lazyWindowsGen(iterable, windowSize));
}
