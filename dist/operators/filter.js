export function* lazyFilterGen(iterable, predicate) {
    for (const value of iterable) {
        if (predicate(value)) {
            yield value;
        }
    }
}
//# sourceMappingURL=filter.js.map