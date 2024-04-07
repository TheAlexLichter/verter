import type { MagicString } from "@vue/compiler-sfc";
import type { WalkResult } from "../../../types";

export type TranspileContext = {
  s: MagicString;

  // prevent the identifiers from getting the accessor prefixed
  // for example the v-for="item in items" has "item" added, because
  // is a blocked variable
  ignoredIdentifiers: string[];

  // expose declarations, in case we need to import something
  // or declare a specific variable
  declarations: WalkResult[];

  accessors: {
    /**
     * Override the accessor for the template ctx
     * @default "___VERTER___ctx"
     */
    ctx: string;

    /**
     * Override the accessor for the template component
     * @default "___VERTER___comp"
     */
    comp: string;

    /**
     * Override the accessor for slot
     * @default "___VERTER___slot"
     */
    slot: string;

    /**
     * Override the accessor for slot
     * @default "___VERTER___template"
     */
    template: string;
  };

  conditions: {
    // current conditions
    ifs: string[];
    // other conditions
    elses: string[];
  };

  webComponents: string[];
};
