import { createBuilder } from "./builder.js";
describe("builder", () => {
  it("test", () => {
    const builder = createBuilder({});

    const res = builder.process(
      "test.vue",
      `<script setup lang="ts">
const model = defineModel<{ foo: string }>();
const test = defineProps('test', { type: String });
</script>
<template>
  <span>1</span>
</template>
    `
    );
  });
});
