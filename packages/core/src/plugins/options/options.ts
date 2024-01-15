import { checkForSetupMethodCall, retrieveNodeString } from "../helpers.js";
import { LocationType, PluginOption } from "../types.js";

const possibleExports = [
  "export default /*#__PURE__*/_",
  "export default /*#__PURE__*/",
  "export default ",
];

export default {
  name: "Options",

  process: (context) => {
    const source = context.script?.content;
    if (!source) return;

    // setup is very easy to process since export default is always the last thing
    if (context.isSetup) {
      let content: string = source;
      for (let i = 0; i < possibleExports.length; i++) {
        const element = possibleExports[i];
        const indexOf = content.indexOf(element);
        if (~indexOf) {
          content = content.slice(indexOf + element.length);
          break;
        }
      }

      if (content.startsWith("defineComponent")) {
        content = content.slice("defineComponent".length);
      }

      return [
        {
          type: LocationType.Import,
          node: context.script,
          // TODO change the import location
          from: "vue",
          items: [
            {
              name: "defineComponent",
              type: true,
            },
          ],
        },
        {
          type: LocationType.Declaration,
          node: context.script,
          declaration: {
            name: "__options",
            content: `defineComponent(${content})`,
          },
        },
        {
          type: LocationType.Declaration,
          node: context.script,
          declaration: {
            type: "type",
            name: "Type__options",
            content: `typeof __options`,
          },
        },
        // {
        //   type: LocationType.Export,
        //   node: context.script,
        //   item: {
        //     default: true,
        //     name: "__options",
        //     alias: "Type__options",
        //     type: true,
        //   },
        // },
      ];
    }

    return [
      {
        type: LocationType.Import,
        node: context.script,
        // TODO change the import location
        from: "vue",
        items: [
          {
            name: "defineComponent",
            type: true,
          },
        ],
      },
    ];
  },

  //   walk: (node, context) => {
  //     if (!context.isSetup) return;
  //     const expression = checkForSetupMethodCall("defineSlots", node);
  //     if (!expression) return;
  //     const source = context.script!.loc.source;

  //     const slotType = expression.typeParameters?.params[0];
  //     if (!slotType) return;

  //     return [
  //       {
  //         type: LocationType.Import,
  //         node: expression,
  //         // TODO change the import location
  //         from: "vue",
  //         items: [
  //           {
  //             name: "SlotsType",
  //             type: true,
  //           },
  //         ],
  //       },
  //       {
  //         type: LocationType.Slots,
  //         node: expression,
  //         content: `SlotsType<${retrieveNodeString(slotType, source)}>`,
  //       },
  //     ];
  //   },
} satisfies PluginOption;
