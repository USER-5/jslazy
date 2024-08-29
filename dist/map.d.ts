import type { ReversibleLazy } from "./array";
export type Mapper<T, R> = (value: T) => R;
export declare function lazyMap<T, R>(lazyArray: ReversibleLazy<T>, mapper: Mapper<T, R>): ReversibleLazy<R>;
