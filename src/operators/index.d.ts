import { type Action } from "./do.js";
import { type Predicate } from "./filter.js";
import type { LazyIterable } from "../index.js";
import { type Mapper } from "./map.js";
export { lazyAny } from "./any.js";
export { lazyAll } from "./all.js";
export { collectDeep } from "./collectDeep.js";
export declare function lazyMap<T, V>(
  iterable: Iterable<T>,
  mappingFunction: Mapper<T, V>,
): Iterable<V>;
export declare function lazyFlatMap<T, V>(
  iterable: Iterable<T>,
  mappingFunction: Mapper<T, Iterable<V>>,
): Iterable<V>;
export declare function lazyFilter<T>(
  iterable: Iterable<T>,
  predicate: Predicate<T>,
): Iterable<T>;
export declare function lazyDo<T>(
  iterable: Iterable<T>,
  action: Action<T>,
): Iterable<T>;
export declare function lazyLimit<T>(
  iterable: Iterable<T>,
  nValues: number,
): Iterable<T>;
export declare function lazyTakeUntil<T>(
  iterable: Iterable<T>,
  predicate: Predicate<T>,
): Iterable<T>;
export declare function lazyTakeWhile<T>(
  iterable: Iterable<T>,
  predicate: Predicate<T>,
): Iterable<T>;
export declare function lazyWindows<T>(
  iterable: Iterable<T>,
  windowSize: number,
): Iterable<LazyIterable<T>>;
