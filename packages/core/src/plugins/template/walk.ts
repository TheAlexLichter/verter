import {
  AttributeNode,
  DirectiveNode,
  ElementNode,
  ElementTypes,
  ExpressionNode,
  ForParseResult,
  NodeTypes,
  TemplateChildNode,
} from "@vue/compiler-core";
import { MagicString } from "@vue/compiler-sfc";

export function walk(node: TemplateChildNode, magicString: MagicString) {
  switch (node.type) {
    case NodeTypes.ELEMENT: {
      return walkElement(node, magicString);
    }
    case NodeTypes.TEXT: {
      return node.content;
    }
    case NodeTypes.COMMENT: {
      break;
    }
    case NodeTypes.INTERPOLATION: {
      break;
    }
    case NodeTypes.COMPOUND_EXPRESSION: {
      break;
    }
    case NodeTypes.IF: {
      break;
    }
    case NodeTypes.IF_BRANCH: {
      break;
    }
    case NodeTypes.FOR: {
      break;
    }
    case NodeTypes.TEXT_CALL: {
      break;
    }
    default: {
      // @ts-expect-error unknown type
      throw new Error(`Unknown node type ${node.type}`);
    }
  }
  return "";
}

export function walkElement(
  node: ElementNode,
  magicString: MagicString
): string {
  const childrenContent = node.children.map((x) => walk(x, magicString));
  const attrs = node.props.map((node) => walkAttribute(node, magicString));

  const vfor = attrs.find((x) => !!x.for) as WalkAttributeFor | undefined;
  const vIf = attrs.find((x) => !!x.if) as WalkAttributeIf | undefined;
  const attributes = attrs.filter(
    (x) => x.attribute === true || x.binding === true
  ) as WalkAttributeAttr[];
  const directives = attrs.filter(
    (x) => x.directive === true && x.binding !== true
  ) as WalkAttributeDirective[];

  // if (vfor) {
  //   attributes.unshift({
  //     attribute: true,
  //     name: "key",
  //     content: `{${vfor.for.value}}`,
  //     node: vfor.for.value,
  //   });
  // }

  switch (node.tagType) {
    case ElementTypes.ELEMENT: {
      // node.props;

      // const props = node.props.map((x) => walkAttribute(x, magicString));

      // const res = `<${node.tag} ${attributes.filter(x=>!x.for).map(x=> )}>${}`

      const elementStr = `<${node.tag} ${attributes
        .map((x) => attributeToString(x, magicString))
        .join(" ")}>${childrenContent.join("\n")}</${node.tag}>`;

      // v-if has higher priority than v-for
      return wrapWithIf(
        wrapWithFor(elementStr, vfor, magicString),
        vIf,
        magicString
      );
    }
    case ElementTypes.COMPONENT: {
      // const props = node.props.map((x) => walkAttribute(x, magicString));

      // if(props.)
      break;
    }
    case ElementTypes.SLOT: {
      break;
    }
    case ElementTypes.TEMPLATE: {
      break;
    }
    default: {
      // @ts-expect-error unknown type
      throw new Error(`Unknown element type ${node.tagType}`);
    }
  }
  return "";
}

function wrapWithIf(
  content: string,
  ifNode: WalkAttributeIf | undefined,
  magicString: MagicString
): string {
  if (!ifNode) return content;
  return `{ ${ifNode.if} ( ${ifNode.content} ){ ${content} } }`;
}

function wrapWithFor(
  content: string,
  forNode: WalkAttributeFor | undefined,
  magicString: MagicString
): string {
  if (!forNode) return content;
  const { source, value, key, index } = forNode.for;

  const keyString = key
    ? walkExpressionNode(key, forNode.node, magicString)
    : "";
  const indexString = index
    ? walkExpressionNode(index, forNode.node, magicString)
    : "";

  const sourceString = source
    ? walkExpressionNode(source, forNode.node, magicString)
    : "()";

  const valueString = value
    ? walkExpressionNode(value, forNode.node, magicString)
    : "value";

  const str = `{ renderList(${sourceString}, (${[
    valueString,
    keyString,
    indexString,
  ]
    .filter(Boolean)
    .join(", ")}) => { ${content} }) }`;

  // magicString.prependLeft(forParseResult.node.loc.start.offset, str);
  return str;
}

function attributeToString(
  attribute: WalkAttributeAttr | WalkAttributeDirectiveBinding,
  magicString: MagicString
) {
  const { name, content } = attribute;
  if (attribute.binding) {
    return `${name}={${content}}`;
  }
  return `${name}=${content}`;
}

interface WalkAttributeBase {
  node: AttributeNode | DirectiveNode;

  content?: string | undefined;
  attribute?: boolean;
  directive?: boolean;
  binding?: boolean;
  for?: undefined | ForParseResult;
  if?: "if" | "else";
}

interface WalkAttributeAttr extends WalkAttributeBase {
  attribute: true;
  node: AttributeNode;
  name: string;
  content: string | undefined;
}

interface WalkAttributeDirective extends WalkAttributeBase {
  directive: true;
  node: DirectiveNode;
  name?: string;
  content: string | undefined;
}
interface WalkAttributeDirectiveBinding extends WalkAttributeBase {
  directive: true;
  binding: true;
  node: DirectiveNode;
  name: string;
  content: string | undefined;
}
interface WalkAttributeFor extends WalkAttributeBase {
  for: ForParseResult;
  node: DirectiveNode;
}
interface WalkAttributeIf extends WalkAttributeBase {
  if: "if" | "else";
  node: DirectiveNode;
}

type WalkAttributeResult =
  | WalkAttributeAttr
  | WalkAttributeDirective
  | WalkAttributeFor
  | WalkAttributeIf
  | WalkAttributeDirectiveBinding;

export function walkAttribute(
  node: AttributeNode | DirectiveNode,
  magicString: MagicString
): WalkAttributeResult {
  switch (node.type) {
    case NodeTypes.ATTRIBUTE: {
      return {
        attribute: true,
        node,
        name: node.name,
        content: node.value ? walk(node.value, magicString) : undefined,
      };
    }
    case NodeTypes.DIRECTIVE: {
      if (node.forParseResult) {
        return {
          for: node.forParseResult,
          node: node,
        };
      }
      if (node.rawName === "v-if") {
        return {
          if: "if",
          node: node,
          content: node.exp
            ? walkExpressionNode(node.exp!, node, magicString)
            : undefined,
        };
      }
      if (node.rawName === "v-else") {
        return {
          if: "else",
          node: node,
          content: "true",
        };
      }

      return {
        directive: true,
        binding: node.name === "bind",
        node,
        name: node.arg
          ? walkExpressionNode(node.arg, node, magicString)
          : undefined,
        content: node.exp
          ? walkExpressionNode(node.exp, node, magicString)
          : undefined,
      };
    }
    default: {
      // @ts-expect-error unknown type
      throw new Error(`Unknown attribute type ${node.type}`);
    }
  }
}

export function walkExpressionNode(
  node: ExpressionNode,
  parent: AttributeNode | DirectiveNode,
  magicString: MagicString
) {
  switch (node.type) {
    case NodeTypes.SIMPLE_EXPRESSION: {
      // magicString.update(
      //   node.loc.start.offset,
      //   node.loc.end.offset,
      //   node.content
      // );
      // // TODO handle hoisted
      return node.content;
      break;
    }
    case NodeTypes.COMPOUND_EXPRESSION: {
      break;
    }
    default: {
      // @ts-expect-error unknown type
      throw new Error(`Unknown expression type ${node.type}`);
    }
  }
}

// export function returnWrapAttributes(props: )
