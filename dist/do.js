export function* lazyDo(iterable, action) {
    for (const value of iterable) {
        action(value);
        yield value;
    }
}
//# sourceMappingURL=do.js.map