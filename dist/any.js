export function lazyAny(lazyIterable, predicate) {
    for (const item of lazyIterable) {
        if (predicate(item)) {
            // early terminate
            return true;
        }
    }
    return false;
}
//# sourceMappingURL=any.js.map