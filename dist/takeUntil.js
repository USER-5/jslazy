import { lazyTakeWhile } from "./takeWhile";
export function lazyTakeUntil(lazyIterable, predicate) {
    // Just invert the predicate and use takeWhile
    return lazyTakeWhile(lazyIterable, (v) => !predicate(v));
}
//# sourceMappingURL=takeUntil.js.map