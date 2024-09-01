import { lazy } from "./index.js";
function isIterable(val) {
    return typeof val === "object" && val != null && Symbol.iterator in val;
}
export function collectDeep(iterable) {
    return lazy(iterable)
        .map((item) => {
        if (isIterable(item)) {
            return collectDeep(item);
        }
        else {
            return item;
        }
    })
        .collect();
}
//# sourceMappingURL=collectDeep.js.map