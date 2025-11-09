import { definePlugin } from "../../types";

export const DeclarePlugin = definePlugin({
  name: "VerterDeclare",

  // add known bindings
  transformDeclaration(item, s) {
    if (!item.declare) return;

    if (item.declarator) {
      // @ts-expect-error TODO FIX THIS TYPE
      s.move(item.declarator.start, item.declarator.end, 0);
    } else {
      // @ts-expect-error TODO FIX THIS TYPE
      s.move(item.node.start, item.node.end, 0);
    }
  },
});
