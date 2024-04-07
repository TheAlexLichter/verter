import { NodeTypes } from "@vue/compiler-core";
import { createTranspiler } from "../../utils";

export default createTranspiler(NodeTypes.INTERPOLATION, {
  enter(node, parent, context) {
    debugger;
  },
  leave(node, parent, context) {},
});
