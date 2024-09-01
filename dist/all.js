import { lazy } from "./index.js";
export function lazyAll(iterable, predicate) {
    // In boolean logic:
    //  a & b & c & ... === !(!a | !b | !c | ...)
    // So, we can just defer to `any` if we negate the predicate, and the result
    return !lazy(iterable).any((v) => !predicate(v));
}
//# sourceMappingURL=all.js.map