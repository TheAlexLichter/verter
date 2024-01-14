import {
  defineComponent,
  DeclareComponent,
  ComponentData,
  DeclareEmits,
  EmitsToProps,
  ComponentProps,
  SlotsType,
  useModel as _useModel,
} from "vue";

const __model_modelValue = defineModel({
  default: false,
});;

type __COMP__ = DeclareComponent<{test: { foo: string }
modelValue: ExtractModelType<typeof __model_modelValue>} & EmitsToProps<{['update:test']: [{ foo: string }]
['update:modelValue']: [ExtractModelType<typeof __model_modelValue>]}>,ComponentData<typeof ComponentOptions>, {['update:test']: [{ foo: string }]
['update:modelValue']: [ExtractModelType<typeof __model_modelValue>]}, SlotsType<{}>, typeof ComponentOptions>; const ComponentOptions = defineComponent(({
  __name: 'Comp',
  props: {
    "test": { type: Object },
    "testModifiers": {},
    "modelValue": {
  default: false,
},
    "modelModifiers": {},
  },
  emits: ["update:test", "update:modelValue"],
  setup(__props, { expose: __expose }) {
  __expose();

const testModel = _useModel<{ foo: string }>(__props, "test");
const model = _useModel(__props, "modelValue");

const __returned__ = { testModel, model }
Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true })
return __returned__
}

}));
declare const Comp: __COMP__;

expectType<{
  (event: "update:modelValue", value: boolean): void;
  (event: "update:test", value: { foo: string }): void;
}>(getComponentEmits(Comp));

expectType<{
  (event: "onUpdate:modelValue"): void;
  // @ts-expect-error not any
}>(getComponentEmits(Comp));

const props = getComponentProps(Comp);

props.modelValue;
props.test;

// @ts-expect-error does not exist
props.randomProp;

expectType<{
  modelValue: boolean;
  test?: { foo: string };
  "onUpdate:modelValue"?: (v: boolean) => void;
  "onUpdate:test"?: (v: { foo: string }) => void;
}>(props);

expectType<{
  onRandom?: () => void;
  // @ts-expect-error not any
}>(props);
