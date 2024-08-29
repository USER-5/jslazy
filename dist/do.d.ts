import type { ReversibleLazy } from "./array";
export type Action<T> = (value: T) => void;
export declare function lazyDo<T>(lazyArray: ReversibleLazy<T>, action: Action<T>): ReversibleLazy<T>;
