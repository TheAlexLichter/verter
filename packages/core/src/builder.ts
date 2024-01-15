import {
  LocationByType,
  LocationType,
  ParseScriptContext,
  PluginOption,
  TypeLocation,
  WalkResult,
} from "./plugins/types.js";
import type { CompilerOptions } from "@vue/compiler-core";
import { compileScript, parse } from "@vue/compiler-sfc";

import { defaultPlugins } from "./plugins/index.js";
import { Statement } from "@babel/types";

export interface Builder {
  build(): void;
}

export interface BuilderOptions {
  plugins: PluginOption[];

  vue: {
    compiler: CompilerOptions;
  };

  // enables legacy mode, used mainly for before v3.5
  legacy: boolean;
}

export function createBuilder(config?: Partial<BuilderOptions>) {
  const plugins: PluginOption[] = [
    ...defaultPlugins,
    ...(config?.plugins ?? []),
  ];

  return {
    process(filename: string, source: string) {
      const parsed = parse(source, {
        filename,
      });

      const compiled = compileScript(parsed.descriptor, {
        id: filename,
        ...config?.vue?.compiler,
      });

      const context = {
        filename,
        id: filename,
        isSetup: Boolean(compiled.setup),
        sfc: parsed,
        script: compiled,
        generic: compiled.attrs.generic,
      } satisfies ParseScriptContext;

      if (!context.script) throw new Error("No script found");

      // create a map
      const locations = [
        ...processPlugins(plugins, context),
        ...walkPlugins(plugins, context),
      ].reduce((prev, curr) => {
        if (!curr) return prev;
        const type = curr.type;
        if (!prev[type]) prev[type] = [];
        prev[type]!.push(curr);
        return prev;
      }, {} as Record<LocationType, TypeLocation[]>) as unknown as LocationByType;

      // todo move this away
      return this.finalise(locations, context);

      //   const processed = [...processPlugins(locations, plugins, context)];
    },
    finalise(map: LocationByType, context: ParseScriptContext) {
      // TODO should group imports
      const imports = map[LocationType.Import]?.reduce((prev, curr) => {
        return `${prev}\nimport { ${curr.items
          .map((it) => it.name)
          .join(", ")} } from '${curr.from}';`;
      }, "");

      const declarations = map[LocationType.Declaration]?.reduce(
        (prev, curr) => {
          return `${prev}\n${curr.declaration.type ?? "const"} ${
            curr.declaration.name
          } = ${curr.declaration.content};`;
        },
        ""
      );

      const _props = map[LocationType.Props]
        ?.map((x) => {
          if (x.properties) {
            return `{ ${x.properties
              .map((x) => `${x.name}: ${x.content}`)
              .join(", ")} }`;
          } else {
            return x.content;
          }
        })
        .join(" & ");

      const _emits = map[LocationType.Emits]
        ?.map((x) => {
          if (x.properties) {
            return `{ ${x.properties
              .map((x) => `${x.name}: [${x.content}]`)
              .join(", ")} }`;
          } else {
            return x.content;
          }
        })
        .join(" & ");

      const emits = _emits ? `DeclareEmits<${_emits}>` : undefined;
      const props = [_props, emits && `EmitsToProps<${emits}>`]
        .filter(Boolean)
        .join(" & ");

      const slots =
        map[LocationType.Slots]?.map((x) => x.content).join(" & ") || "{}";

      const genericOrProps = context.generic
        ? `{ new<${context.generic}>(): { $props: ${props || "{}"}, $emit: ${
            emits || "{}"
          } , $children: ${slots || "{}"}  } }`
        : props;

      // TODO better resolve the final variable names, especially options
      // because it relying on the plugin to build
      const declareComponent = `type __COMP__ = DeclareComponent<__PROPS__, __DATA__, __EMITS__, __SLOTS__, Type__options>`;

      (map[LocationType.Export] ?? (map[LocationType.Export] = [])).push({
        type: LocationType.Export,
        node: undefined as any,
        item: {
          default: true,
          name: "__options",
          alias: "__COMP__",
          type: true,
        },
      });

      const exports = map[LocationType.Export]?.reduce((prev, curr) => {
        return `${prev}\nexport ${curr.item.default ? "default" : "const"} ${
          curr.item.default
            ? curr.item.content || curr.item.name
            : curr.item.name
        }${curr.item.alias ? " as " + curr.item.alias : ""};`;
      }, "");

      return `${imports}\n
${declarations}\n

type __PROPS__ = ${props};

type __DATA__ = {};

type __EMITS__ = ${emits};

type __SLOTS__ = ${slots};

${declareComponent}

${exports || ""}
        `;
    },
  };
}

function* walkPlugins(plugins: PluginOption[], context: ParseScriptContext) {
  yield* runPlugins((plugin) => plugin.walk, plugins, context);
}
function* processPlugins(plugins: PluginOption[], context: ParseScriptContext) {
  for (const plugin of plugins) {
    if (!plugin.process) continue;
    const result = plugin.process(context);
    if (!result) continue;
    if (Array.isArray(result)) {
      yield* result;
    } else {
      yield result;
    }
  }
}

function* runPlugins(
  cb: (
    plugin: PluginOption
  ) =>
    | undefined
    | ((state: Statement, context: ParseScriptContext) => void | WalkResult),
  plugins: PluginOption[],
  context: ParseScriptContext
) {
  if (!context.script) return;
  const ast = context.script.scriptSetupAst ?? context.script.scriptAst;
  if (!ast) return;
  for (const statement of ast) {
    for (const plugin of plugins) {
      const result = cb(plugin)?.(statement, context);
      if (!result) continue;
      if (Array.isArray(result)) {
        yield* result;
      } else {
        yield result;
      }
    }
  }
}
