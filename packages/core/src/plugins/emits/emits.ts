import { checkForSetupMethodCall } from "../helpers.js";
import { LocationType, PluginOption } from "../types.js";

export default {
  name: "Emits",

  walk: (node, context) => {
    if (!context.isSetup) return;
    const expression = checkForSetupMethodCall("defineEmits", node);
    if (!expression) return;

    console.log("found emits");
    // TODO add sourmap map
    return {
      type: LocationType.Emits,
      node: expression,
    };
  },
} satisfies PluginOption;
