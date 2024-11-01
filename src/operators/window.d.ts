import { type LazyIterable } from "../index.js";
export type Mapper<T, R> = (value: T) => R;
export declare function lazyWindowsGen<T>(
  parent: Iterable<T>,
  windowSize: number,
): Iterable<LazyIterable<T>>;
