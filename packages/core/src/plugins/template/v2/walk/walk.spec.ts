import { walk } from "./walk";
import { parse as sfcParse } from "@vue/compiler-sfc";

describe("walk", () => {
  function parse(content: string) {
    const source = `<template>${content}</template>`;
    const ast = sfcParse(source, {
      templateParseOptions: {},
    });
    const root = ast.descriptor.template!.ast!;
    return root;
  }
  it("should work", () => {
    const parsed = parse("<div>{{test}}</div>");
    walk(parsed, {}, {});
  });
});
