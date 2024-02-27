import {
  DeclareComponent,
  ComponentProps,
  ComponentEmits,
  ComponentData,
  ComponentSlots,
  ModelRef,
} from "vue";

declare global {
  var __COMP__: DeclareComponent;

  function expectType<T>(value: T): void;

  // extract

  function getComponentProps<T>(component: T): ComponentProps<T>;
  function getComponentEmits<T>(component: T): ComponentEmits<T>;
  function getComponentData<T>(component: T): ComponentData<T>;
  function getComponentSlots<T>(component: T): ComponentSlots<T>;

  // NOTE THIS SHOULDN'T be needed... but it is
  function _useModel<T extends any>(...args: any[]): any;

  type ExtractModelType<T> = T extends ModelRef<infer V> ? V : any;
}
