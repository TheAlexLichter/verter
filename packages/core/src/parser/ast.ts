import { NodeTypes } from "@vue/compiler-core";
import type {
  baseParse,
  Node,
  // Node types
  ElementNode,
  TextNode,
  CommentNode,
  SimpleExpressionNode,
  InterpolationNode,
  AttributeNode,
  DirectiveNode,
  CompoundExpressionNode,
  IfNode,
  IfBranchNode,
  ForNode,
  TextCallNode,
  VNodeCall,
  CallExpression,
  ObjectExpression,
  Property,
  ArrayExpression,
  FunctionExpression,
  ConditionalExpression,
  CacheExpression,
  BlockStatement,
  TemplateLiteral,
  IfStatement,
  AssignmentExpression,
  SequenceExpression,
  ReturnStatement,
} from "@vue/compiler-core";
import type { Node as TsNode, NodeFactory } from "typescript";
import * as ts from "typescript";

type RootNode = ReturnType<typeof baseParse>;

function processROOT(factory: NodeFactory, node: RootNode) {
  const identifier = factory.createIdentifier("defineComponent");

  return factory.createFunctionDeclaration(
    undefined,
    undefined,
    identifier,
    undefined,
    [],
    null,
    factory.createBlock(
      [
        // factory
        //   .createReturnStatement
        //   factory.createParenthesizedExpression(
        //     // TODO support more children
        //     parseNode(factory, children[0])
        //   )
        //   (),
      ],
      true
    )
  );
}
function processELEMENT(factory: NodeFactory, node: ElementNode): TsNode {
  const identifier = factory.createIdentifier("defineComponent");
  identifier.pos = node.loc.start.offset;

  return processROOT(factory, node);
}
function processTEXT(factory: NodeFactory, node: TextNode): TsNode {}
function processCOMMENT(factory: NodeFactory, node: CommentNode): TsNode {}
function processSIMPLE_EXPRESSION(
  factory: NodeFactory,
  node: SimpleExpressionNode
): TsNode {}
function processINTERPOLATION(
  factory: NodeFactory,
  node: InterpolationNode
): TsNode {}
function processATTRIBUTE(factory: NodeFactory, node: AttributeNode): TsNode {}
function processDIRECTIVE(factory: NodeFactory, node: DirectiveNode): TsNode {}
function processCOMPOUND_EXPRESSION(
  factory: NodeFactory,
  node: CompoundExpressionNode
): TsNode {}
function processIF(factory: NodeFactory, node: IfNode) {}
function processIF_BRANCH(factory: NodeFactory, node: IfBranchNode): TsNode {}
function processFOR(factory: NodeFactory, node: ForNode) {}
function processTEXT_CALL(factory: NodeFactory, node: TextCallNode): TsNode {}
function processVNODE_CALL(factory: NodeFactory, node: VNodeCall): TsNode {}
function processJS_CALL_EXPRESSION(
  factory: NodeFactory,
  node: CallExpression
): TsNode {}
function processJS_OBJECT_EXPRESSION(
  factory: NodeFactory,
  node: ObjectExpression
): TsNode {}
function processJS_PROPERTY(factory: NodeFactory, node: Property) {}
function processJS_ARRAY_EXPRESSION(
  factory: NodeFactory,
  node: ArrayExpression
): TsNode {}
function processJS_FUNCTION_EXPRESSION(
  factory: NodeFactory,
  node: FunctionExpression
): TsNode {}
function processJS_CONDITIONAL_EXPRESSION(
  factory: NodeFactory,
  node: ConditionalExpression
): TsNode {}
function processJS_CACHE_EXPRESSION(
  factory: NodeFactory,
  node: CacheExpression
): TsNode {}
function processJS_BLOCK_STATEMENT(
  factory: NodeFactory,
  node: BlockStatement
): TsNode {}
function processJS_TEMPLATE_LITERAL(
  factory: NodeFactory,
  node: TemplateLiteral
): TsNode {}
function processJS_IF_STATEMENT(factory: NodeFactory, node: IfStatement) {}
function processJS_ASSIGNMENT_EXPRESSION(
  factory: NodeFactory,
  node: AssignmentExpression
): TsNode {}
function processJS_SEQUENCE_EXPRESSION(
  factory: NodeFactory,
  node: SequenceExpression
): TsNode {}
function processJS_RETURN_STATEMENT(
  factory: NodeFactory,
  node: ReturnStatement
): TsNode {}

export const Parsers = {
  [0 /*NodeTypes.ROOT*/]: processROOT,
  [1 /*NodeTypes.ELEMENT*/]: processELEMENT,
  [2 /*NodeTypes.TEXT*/]: processTEXT,
  [3 /*NodeTypes.COMMENT*/]: processCOMMENT,
  [4 /*NodeTypes.SIMPLE_EXPRESSION*/]: processSIMPLE_EXPRESSION,
  [5 /*NodeTypes.INTERPOLATION*/]: processINTERPOLATION,
  [6 /*NodeTypes.ATTRIBUTE*/]: processATTRIBUTE,
  [7 /*NodeTypes.DIRECTIVE*/]: processDIRECTIVE,
  [8 /*NodeTypes.COMPOUND_EXPRESSION*/]: processCOMPOUND_EXPRESSION,
  [9 /*NodeTypes.IF*/]: processIF,
  [10 /*NodeTypes.IF_BRANCH*/]: processIF_BRANCH,
  [11 /*NodeTypes.FOR*/]: processFOR,
  [12 /*NodeTypes.TEXT_CALL*/]: processTEXT_CALL,
  [13 /*NodeTypes.VNODE_CALL*/]: processVNODE_CALL,
  [14 /*NodeTypes.JS_CALL_EXPRESSION*/]: processJS_CALL_EXPRESSION,
  [15 /*NodeTypes.JS_OBJECT_EXPRESSION*/]: processJS_OBJECT_EXPRESSION,
  [16 /*NodeTypes.JS_PROPERTY*/]: processJS_PROPERTY,
  [17 /*NodeTypes.JS_ARRAY_EXPRESSION*/]: processJS_ARRAY_EXPRESSION,
  [18 /*NodeTypes.JS_FUNCTION_EXPRESSION*/]: processJS_FUNCTION_EXPRESSION,
  [19 /*NodeTypes.JS_CONDITIONAL_EXPRESSION*/]:
    processJS_CONDITIONAL_EXPRESSION,
  [20 /*NodeTypes.JS_CACHE_EXPRESSION*/]: processJS_CACHE_EXPRESSION,
  [21 /*NodeTypes.JS_BLOCK_STATEMENT*/]: processJS_BLOCK_STATEMENT,
  [22 /*NodeTypes.JS_TEMPLATE_LITERAL*/]: processJS_TEMPLATE_LITERAL,
  [23 /*NodeTypes.JS_IF_STATEMENT*/]: processJS_IF_STATEMENT,
  [24 /*NodeTypes.JS_ASSIGNMENT_EXPRESSION*/]: processJS_ASSIGNMENT_EXPRESSION,
  [25 /*NodeTypes.JS_SEQUENCE_EXPRESSION*/]: processJS_SEQUENCE_EXPRESSION,
  [26 /*NodeTypes.JS_RETURN_STATEMENT*/]: processJS_RETURN_STATEMENT,
} satisfies {
  [K in NodeTypes]: (factory: NodeFactory, node: NodeTypes[K]) => TsNode;
};

export function parseNode(factory: NodeFactory, node: Node): TsNode {
  const p = Parsers[node.type];
  const n = p(factory, node);

  //   console.log("returnnign", n, node.type);
  return n;
}
