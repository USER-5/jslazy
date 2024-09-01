import { lazy } from "./index.js";
function* generateWindows(parent, windowSize) {
    let seenItems = [];
    while (seenItems.length < windowSize) {
        const nextItem = parent.next();
        if (nextItem.done) {
            return;
        }
        seenItems.push(nextItem.value);
    }
    while (true) {
        yield lazy(seenItems);
        const nextItem = parent.next();
        if (nextItem.done) {
            return;
        }
        seenItems = [...seenItems];
        seenItems.push(nextItem.value);
        seenItems.splice(0, 1);
    }
}
export function lazyWindow(lazyArray, windowSize) {
    const windowsIterable = {
        [Symbol.iterator]() {
            return generateWindows(lazyArray[Symbol.iterator](), windowSize);
        },
    };
    return lazy(windowsIterable);
}
//# sourceMappingURL=window.js.map