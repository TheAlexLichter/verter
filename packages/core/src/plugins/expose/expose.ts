import { checkForSetupMethodCall } from "../helpers.js";
import { LocationType, PluginOption } from "../types.js";

export default {
  name: "Props",

  walk: (node, context) => {
    if (!context.isSetup) return;
    const expression = checkForSetupMethodCall("defineExpose", node);
    if (!expression) return;

    console.log("found expose");
    // TODO add sourmap map
    return {
      type: LocationType.Expose,
      node: expression,
    };
  },
} satisfies PluginOption;
