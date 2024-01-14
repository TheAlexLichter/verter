import { checkForSetupMethodCall } from "../helpers.js";
import { LocationType, PluginOption } from "../types.js";

export default {
  name: "Slots",

  walk: (node, context) => {
    if (!context.isSetup) return;
    const expression = checkForSetupMethodCall("defineSlots", node);
    if (!expression) return;

    console.log("found slots");
    // TODO add sourmap map
    return {
      type: LocationType.Slots,
      node: expression,
    };
  },
} satisfies PluginOption;
