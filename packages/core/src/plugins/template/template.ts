import { LocationType, PluginOption, WalkResult } from "../types.js";
import { transpile } from "./v2/transpile";

export default {
  name: "Template",

  process: (context) => {
    const template = context.template;
    if (!template) return;

    const ast = template.ast;

    if (!ast) return;

    const declarations = [] as WalkResult[];
    try {
      const { accessors } = transpile(ast, context.s, { declarations });

      declarations.push({
        type: LocationType.Import,
        from: "vue",
        generated: true,
        items: [
          {
            name: "renderList",
            alias: accessors.renderList,
          },
          {
            name: "normalizeClass",
            alias: accessors.normalizeClass,
          },
          {
            name: "normalizeStyle",
            alias: accessors.normalizeStyle,
          },
        ],
      });
    } catch (e) {
      console.error("eee", e);
    }
    // const parsed = parse(ast);

    // const result = build(parsed, [], declarations);
    // const { declarations } = process(parsed, context.s, false);

    return [
      {
        type: LocationType.Template,
        node: ast,
      },
      // {
      //   type: LocationType.Import,
      //   from: 'vue',
      //   items: [
      //     {
      //       name: 'renderList',
      //       alias: context.
      //     }
      //   ]
      // },
      ...declarations,
    ];
    return {
      type: LocationType.Template,
      node: ast,
      generated: true,
      declaration: {
        name: "VUE_render",
        content: `${
          context.generic ? `<${context.generic},>` : ""
        }()=> { return (\n${result}\n) }`,
        type: "const",
      },
    };
  },
} satisfies PluginOption;
