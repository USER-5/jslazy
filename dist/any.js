export function lazyAny(iterable, predicate) {
    for (const item of iterable) {
        if (predicate(item)) {
            // early terminate
            return true;
        }
    }
    return false;
}
//# sourceMappingURL=any.js.map