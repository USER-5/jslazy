import { lazyTakeWhileGen } from "./takeWhile.js";
export function* lazyTakeUntilGen(iterable, predicate) {
    // Just invert the predicate and use takeWhile
    yield* lazyTakeWhileGen(iterable, (v) => !predicate(v));
}
//# sourceMappingURL=takeUntil.js.map