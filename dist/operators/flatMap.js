import { lazy } from "../index.js";
import { isIntoLazy } from "../lazyIterable.js";
export function* lazyFlatMapGen(iterable, mapper, reverse) {
    for (const parentItem of iterable) {
        let childIterable = mapper(parentItem);
        if (reverse) {
            if (isIntoLazy(childIterable)) {
                childIterable = lazy(childIterable).reverse();
            }
            else {
                // Asked to reverse the parent, but the child wasn't reversible.
                throw "jslazy/FlatMap: Cannot Reverse Child Iterable.\nFlatMap received a non-reversible child iterable and then tried to reverse it";
            }
        }
        for (const item of mapper(parentItem)) {
            yield item;
        }
    }
}
//# sourceMappingURL=flatMap.js.map