export type CollectDeep<T> = T extends Array<unknown> ? T : T extends Iterable<infer ItItem> ? Array<CollectDeep<ItItem>> : T;
export declare function collectDeep<T>(iterable: Iterable<T>): CollectDeep<T>;
