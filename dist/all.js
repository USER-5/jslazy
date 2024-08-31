import { lazy } from "./index";
export function lazyAll(lazyIterable, predicate) {
    // In boolean logic:
    //  a & b & c & ... === !(!a | !b | !c | ...)
    // So, we can just defer to `any` if we negate the predicate, and the result
    return !lazy(lazyIterable).any((v) => !predicate(v));
}
//# sourceMappingURL=all.js.map