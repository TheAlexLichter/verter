import { NodeTypes } from "@vue/compiler-core";
import { createTranspiler } from "../../utils.js";

export default createTranspiler(NodeTypes.TEXT, {
  enter(node, _, { s }) {
    if (node.content.trim()) {
      s.overwrite(
        node.loc.start.offset,
        node.loc.end.offset,
        `{ ${JSON.stringify(node.content)} }`
      );
    }
  },
});
