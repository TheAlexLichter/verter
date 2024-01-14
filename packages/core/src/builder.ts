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
      } satisfies ParseScriptContext;

      if (!context.script) throw new Error("No script found");

      // create a map
      const locations = [...walkPlugins(plugins, context)].reduce(
        (prev, curr) => {
          if (!curr) return prev;
          const type = curr.type;
          if (!prev[type]) prev[type] = [];
          prev[type]!.push(curr);
          return prev;
        },
        {} as Record<LocationType, TypeLocation[]>
      ) as unknown as LocationByType;

      // todo move this away
      return this.finalise(locations);

      //   const processed = [...processPlugins(locations, plugins, context)];
    },
    finalise(map: LocationByType) {
      // TODO should group imports
      const imports = map[LocationType.Import]?.reduce((prev, curr) => {
        return `${prev}\nimport { ${curr.items
          .map((it) => it.name)
          .join(", ")} } from '${curr.from}';`;
      }, "");

      const declarations = map[LocationType.Declaration]?.reduce(
        (prev, curr) => {
          return `${prev}\n${curr.declaration.type ?? 'const'} ${curr.declaration.name} = ${curr.declaration.content};`;
        },
        ""
      );

      return `${imports}\n
${declarations}\n
        `;
    },
  };
}

function* walkPlugins(plugins: PluginOption[], context: ParseScriptContext) {
  yield* runPlugins((plugin) => plugin.walk, plugins, context);
}
function* processPlugins(
  map: LocationByType,
  plugins: PluginOption[],
  context: ParseScriptContext
) {
  for (const it of plugins) {
    const result = it.process?.(map, context);
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
