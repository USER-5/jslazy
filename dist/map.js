export function* lazyMap(iterable, mapper) {
    for (const value of iterable) {
        yield mapper(value);
    }
}
//# sourceMappingURL=map.js.map