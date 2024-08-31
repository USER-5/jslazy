import { forwardLazyIterable } from "./forwardLazyIterable";
import { isIntoLazy, rLazyIterable } from "./lazyIterable";
export function lazy(source) {
    if (isIntoLazy(source)) {
        return rLazyIterable(source);
    }
    else {
        return forwardLazyIterable(source);
    }
}
//# sourceMappingURL=lazy.js.map