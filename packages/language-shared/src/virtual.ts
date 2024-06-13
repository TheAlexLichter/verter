export const helper = `import type {
  GlobalComponents,
  Ref,
  Component,
  IntrinsicElementAttributes,
  ComponentPublicInstance,
  ModelRef,
} from "vue";

export type ExtractModelType<T> = T extends ModelRef<infer V> ? V : any;

export type OmitNever<T> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K];
};
export type ExtractComponent<T> = T extends Ref<infer V>
  ? ExtractComponent<V>
  : T extends Component
  ? T
  : T extends keyof IntrinsicElementAttributes
  ? { new (): { $props: IntrinsicElementAttributes[T] } }
  : never;

export type ExtractRenderComponents<T> = OmitNever<{
  [K in keyof Omit<T, keyof ComponentPublicInstance>]: ExtractComponent<T[K]>;
}> &
  GlobalComponents & {};

type DeepMergerNarrower<T extends Record<PropertyKey, any>[]> = T extends [
  infer A,
  ...infer Rest
]
  ? Rest extends Record<PropertyKey, any>[]
    ? A & DeepMergerNarrower<Rest>
    : A
  : {};

declare function deepMergerNarrower<T extends Record<PropertyKey, any>[]>(
  ...args: T
): DeepMergerNarrower<T>;
`;
