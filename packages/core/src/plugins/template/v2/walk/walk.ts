import type {
  RootNode,
  ParentNode,
  ExpressionNode,
  TemplateChildNode,
} from "@vue/compiler-core";
import { isObject } from "@vue/shared";

export type VerterNode = ParentNode | ExpressionNode | TemplateChildNode;

export type WalkOptions<Context> = {
  enter?: (
    node: VerterNode,
    parent: VerterNode,
    context: Context
  ) => Context | void;
  leave?: (
    node: VerterNode,
    parent: VerterNode,
    context: Context
  ) => Context | void;
};

export function walk<Context>(
  root: RootNode,
  options: WalkOptions<Context>,
  context: Context
) {
  function visit(
    node: VerterNode | null | undefined,
    parent: VerterNode | null | undefined,
    context: Context
  ) {
    if (!node) {
      return;
    }
    const returnedContext = options.enter?.(node, parent, context);
    const overrideContext = returnedContext || context;

    if ("children" in node) {
      for (let i = 0; i < node.children.length; i++) {
        const element = node.children[i];
        if (isObject(element)) {
          visit(element, node, overrideContext);
        }
      }
    }

    options.leave?.(node, parent, context);
  }

  return visit(root, null, context);
}
