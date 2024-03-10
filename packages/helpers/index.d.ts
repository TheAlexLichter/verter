import { ModelRef } from "vue";

export type ExtractModelType<T> = T extends ModelRef<infer V> ? V : any;
