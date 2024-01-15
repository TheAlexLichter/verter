import { createBuilder } from "./builder.js";
describe("builder", () => {
  it("test", () => {
    const builder = createBuilder({});

    const res = builder.process(
      "test.vue",
      `<script setup lang="ts">
const model = defineModel<{ foo: string }>();
const test = defineProps({ type: String });
</script>
<template>
  <span>1</span>
</template>
    `
    );

    expect(res).toMatchInlineSnapshot(`
      "
      import { defineComponent } from 'vue';
      import { ExtractPropTypes } from 'vue';


      const __options = defineComponent(({
        __name: 'test',
        props: /*#__PURE__*/_mergeModels({ type: String }, {
          "modelValue": { type: Object },
          "modelModifiers": {},
        }),
        emits: ["update:modelValue"],
        setup(__props, { expose: __expose }) {
        __expose();

      const model = _useModel<{ foo: string }>(__props, "modelValue");
      const test = __props;

      const __returned__ = { model, test }
      Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true })
      return __returned__
      }

      }));
      type Type__options = typeof __options;
      const __props = defineProps({ type: String });
      type Type__props = ExtractPropTypes<typeof __props>;;


      type __PROPS__ = { modelValue: { foo: string } } & Type__props & EmitsToProps<DeclareEmits<{ 'update:modelValue': [{ foo: string }] }>>;

      type __DATA__ = {};

      type __EMITS__ = DeclareEmits<{ 'update:modelValue': [{ foo: string }] }>;

      type __SLOTS__ = {};

      type __COMP__ = DeclareComponent<__PROPS__, __DATA__, __EMITS__, __SLOTS__, Type__options>


      export default __options as __COMP__;
              "
    `);
  });
});
