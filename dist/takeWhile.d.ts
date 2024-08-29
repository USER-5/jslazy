import type { ReversibleLazy } from "./array";
import type { Predicate } from "./predicate";
export declare function lazyTakeWhile<T>(lazyIterable: ReversibleLazy<T>, predicate: Predicate<T>): ReversibleLazy<T>;
