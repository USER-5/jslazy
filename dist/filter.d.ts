import type { ReversibleLazy } from "./array";
export type Predicate<T> = (value: T) => boolean;
export declare function lazyFilter<T>(lazyIterable: ReversibleLazy<T>, filterFunction: Predicate<T>): ReversibleLazy<T>;
