import { type ForwardLazyIterable, type LazyIterable } from "./index.js";
export type Mapper<T, R> = (value: T) => R;
export declare function lazyWindow<Item, Iter extends ForwardLazyIterable<Item>>(lazyArray: Iter, windowSize: number): Iter extends LazyIterable<Item> ? LazyIterable<LazyIterable<Item>> : ForwardLazyIterable<LazyIterable<Item>>;
