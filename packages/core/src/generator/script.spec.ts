import { compileScript, parse } from "@vue/compiler-sfc";
import { resolveModels } from "./script.js";

describe("Generator script", () => {
  it("should render multiple defineModel", () => {
    const parsed = compileScript(
      parse(`
<script setup lang="ts">
const testModel = defineModel<{ foo: string }>("test");
const model = defineModel({
    default: false,
});
</script>
<template>
    <span>1</span>
</template>
        `).descriptor,
      { id: "random" }
    );

    expect(Array.from(resolveModels(parsed))).toMatchInlineSnapshot(`
      [
        {
          "declaration": undefined,
          "declare": false,
          "name": "test",
          "type": "{ foo: string }",
        },
        {
          "declaration": "defineModel({
          default: false,
      })",
          "declare": true,
          "name": "modelValue",
          "type": "ExtractModelType<typeof __model_modelValue>",
        },
      ]
    `);
  });
  it("should render single defineModel", () => {
    const parsed = compileScript(
      parse(`
      <script setup lang="ts">
      const model = defineModel<{ foo: string }>();
      </script>
      <template>
        <span>1</span>
      </template>
      
        `).descriptor,
      { id: "random" }
    );

    expect(Array.from(resolveModels(parsed))).toMatchInlineSnapshot(`
      [
        {
          "declaration": undefined,
          "declare": false,
          "name": "modelValue",
          "type": "{ foo: string }",
        },
      ]
    `);
  });
});
