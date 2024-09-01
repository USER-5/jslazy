import { lazyTakeWhile } from "./takeWhile.js";
export function* lazyTakeUntil(iterable, predicate) {
    // Just invert the predicate and use takeWhile
    yield* lazyTakeWhile(iterable, (v) => !predicate(v));
}
//# sourceMappingURL=takeUntil.js.map