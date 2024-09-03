import { lazyDoGen } from "./do.js";
import { lazyFilterGen } from "./filter.js";
import { lazyFlatMapGen } from "./flatMap.js";
import { lazyLimitGen } from "./limit.js";
import { lazyMapGen } from "./map.js";
import { lazyTakeUntilGen } from "./takeUntil.js";
import { lazyTakeWhileGen } from "./takeWhile.js";
import { lazyWindowsGen } from "./window.js";
export { lazyAny } from "./any.js";
export { lazyAll } from "./all.js";
export { collectDeep } from "./collectDeep.js";
function generatorToIterable(iterable) {
    return {
        [Symbol.iterator]() {
            return iterable[Symbol.iterator]();
        },
    };
}
export function lazyMap(iterable, mappingFunction) {
    return generatorToIterable(lazyMapGen(iterable, mappingFunction));
}
export function lazyFlatMap(iterable, mappingFunction) {
    return generatorToIterable(lazyFlatMapGen(iterable, mappingFunction, false));
}
export function lazyFilter(iterable, predicate) {
    return generatorToIterable(lazyFilterGen(iterable, predicate));
}
export function lazyDo(iterable, action) {
    return generatorToIterable(lazyDoGen(iterable, action));
}
export function lazyLimit(iterable, nValues) {
    return generatorToIterable(lazyLimitGen(iterable, nValues));
}
export function lazyTakeUntil(iterable, predicate) {
    return generatorToIterable(lazyTakeUntilGen(iterable, predicate));
}
export function lazyTakeWhile(iterable, predicate) {
    return generatorToIterable(lazyTakeWhileGen(iterable, predicate));
}
export function lazyWindows(iterable, windowSize) {
    return generatorToIterable(lazyWindowsGen(iterable, windowSize));
}
//# sourceMappingURL=operators.js.map