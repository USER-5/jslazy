import { lazy } from "../index.js";
export function* lazyFlatMapGen(iterable, mapper, reverse) {
    for (const parentItem of iterable) {
        let childIterable = mapper(parentItem);
        if (reverse) {
            childIterable = lazy(childIterable).reverse();
        }
        for (const item of mapper(parentItem)) {
            yield item;
        }
    }
}
//# sourceMappingURL=flatMap.js.map