import { forwardLazyIterable } from "./forwardLazyIterable.js";
import { isIntoLazy, rLazyIterable } from "./lazyIterable.js";
export function lazy(source) {
    if (isIntoLazy(source)) {
        return rLazyIterable(source);
    }
    else {
        return forwardLazyIterable(source);
    }
}
//# sourceMappingURL=lazy.js.map