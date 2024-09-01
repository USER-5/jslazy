function isIterable(val) {
    return typeof val === "object" && val != null && Symbol.iterator in val;
}
export function collectDeep(iterable) {
    return Array.from(iterable).map((item) => {
        if (isIterable(item)) {
            return collectDeep(item);
        }
        else {
            return item;
        }
    });
}
//# sourceMappingURL=collectDeep.js.map