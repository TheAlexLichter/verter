import { ElementNode } from "@vue/compiler-core";
import { walk } from "./walk";
import { compileTemplate, parse as sfcParse } from "@vue/compiler-sfc";

describe("walk", () => {
  function parse(content: string) {
    const source = `<template>${content}</template>`;
    const ast = sfcParse(source, {
      templateParseOptions: {},
    });
    const root = ast.descriptor.template!.ast!;
    const parent = root;
    return root;
  }
  it("should work", () => {
    const parsed = parse("<div>{{test}}</div>");
    const r = walk(
      parsed,
      {
        enter(node, parent, context) {},
        leave(node, parent, context) {},
      },
      {}
    );
  });
});
