import { lazyIterable } from "./lazyIterable";
import { isIntoReversibleLazy, rLazyIterable, } from "./reversibleLazyIterable";
export function lazy(source) {
    if (isIntoReversibleLazy(source)) {
        return rLazyIterable(source);
    }
    else {
        return lazyIterable(source);
    }
}
//# sourceMappingURL=lazy.js.map