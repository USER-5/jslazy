import { type IntoReversibleLazy, type ReversibleLazy } from "./array";
import type { Mapper } from "./map";
export declare function lazyFlatMap<T, R>(lazyArray: ReversibleLazy<T>, fn: Mapper<T, IntoReversibleLazy<R>>): ReversibleLazy<R>;
