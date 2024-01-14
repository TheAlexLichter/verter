import { checkForSetupMethodCall } from "../helpers.js";
import { LocationType, PluginOption } from "../types.js";

export default {
  name: "Props",

  walk: (node, context) => {
    if (!context.isSetup) return;
    const expression = checkForSetupMethodCall("defineProps", node);
    if (!expression) return;

    console.log("found props");
    // TODO add sourmap map
    return {
      type: LocationType.Props,
      node: expression,
    };
  },
} satisfies PluginOption;
