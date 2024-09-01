export function* lazyLimit(iterable, nValues) {
    let nSeen = 0;
    if (nValues === 0) {
        return;
    }
    for (const value of iterable) {
        yield value;
        nSeen++;
        if (nSeen >= nValues) {
            return;
        }
    }
}
//# sourceMappingURL=limit.js.map