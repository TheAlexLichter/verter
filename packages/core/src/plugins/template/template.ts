import { MagicString } from "@vue/compiler-sfc";
import { checkForSetupMethodCall, retrieveNodeString } from "../helpers.js";
import { LocationType, PluginOption, WalkResult } from "../types.js";

import { walk } from "./walk.js";

import { NodeTypes, ElementTypes } from "@vue/compiler-core";

export default {
  name: "Template",

  process: (context) => {
    const template = context.template;
    if (!template) return;

    const ast = template.ast;
    const source = template.content;
    if (!ast) return;

    const multiRoot = ast.children.length > 1;

    const str = new MagicString(source);

    for (const it of ast.children) {
      const ss = walk(it, str);
      console.log(ss);
    }
    return str.toString();
  },
} satisfies PluginOption;
