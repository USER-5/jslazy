export function* lazyFilter(iterable, predicate) {
    for (const value of iterable) {
        if (predicate(value)) {
            yield value;
        }
    }
}
//# sourceMappingURL=filter.js.map