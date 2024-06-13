import { NodeTypes } from "@vue/compiler-core";
import { createTranspiler } from "../../utils.js";

export default createTranspiler(NodeTypes.COMMENT, {
  enter(node, _, { s }) {
    const commentOpenTag = "<!--";
    const commentCloseTag = "-->";
    const startingTag = node.loc.source.indexOf(commentOpenTag);
    const closingTag = node.loc.source.indexOf(commentCloseTag);

    s.overwrite(
      node.loc.start.offset + startingTag,
      node.loc.start.offset + startingTag + commentOpenTag.length,
      "{/*"
    );

    s.overwrite(
      node.loc.start.offset + closingTag,
      node.loc.start.offset + closingTag + commentCloseTag.length,
      "*/}"
    );
  },
});
