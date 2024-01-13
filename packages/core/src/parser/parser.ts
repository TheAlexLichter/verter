import {
  ElementNode,
  NodeTypes,
  Node,
  TextNode,
  CommentNode,
} from "@vue/compiler-core";
import { SFCTemplateBlock, parse } from "@vue/compiler-sfc";

import * as typescript from "typescript";
import { Program, toPath } from "typescript";
import { parseNode } from "./ast";

export function parseSFC(txt: string) {
  const { descriptor, errors } = parse(txt);

  return {
    descriptor,
    errors,
  };
}

type Options = {
  sourceFile: typescript.SourceFile;
  checker: typescript.TypeChecker;
};

export function parserFiler({ sourceFile, checker }: Options) {
  console.log("sss", sourceFile);
  if (!sourceFile.fileName.endsWith(".vue")) throw new Error("Don't call me");

  console.log(sourceFile.getFullText());
}

export function templateToJSX(
  template: SFCTemplateBlock,
  factory: typescript.NodeFactory
) {
  console.log("template", template.ast);
  return parseNode(factory, template.ast);
  console.log("template", template.ast.children);
}

export function VueAstToNode(element: Node) {
  switch (element.type) {
    case NodeTypes.ROOT:
      return {
        type: "element",
        tag: element.tag,
        children: element.children.map(VueAstToNode),
      };
    case ElementTypes.TEXT:
      return {
        type: "text",
        content: element.content,
      };
  }
}
