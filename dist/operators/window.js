import { lazy } from "../index.js";
export function* lazyWindowsGen(parent, windowSize) {
    let seenItems = [];
    let iterator = parent[Symbol.iterator]();
    while (seenItems.length < windowSize) {
        const nextItem = iterator.next();
        if (nextItem.done) {
            return;
        }
        seenItems.push(nextItem.value);
    }
    while (true) {
        yield lazy(seenItems);
        const nextItem = iterator.next();
        if (nextItem.done) {
            return;
        }
        seenItems = [...seenItems];
        seenItems.push(nextItem.value);
        seenItems.splice(0, 1);
    }
}
//# sourceMappingURL=window.js.map