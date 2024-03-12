import type tsModule from "typescript/lib/tsserverlibrary";
import path from "path";
import fs from "fs";

import { isRelativeVue, isVue } from "./helpers/vueExtensions.js";
import { getDtsSnapshot } from "./helpers/getDtsSnapshot.js";

const init: tsModule.server.PluginModuleFactory = ({ typescript: ts }) => {
  const create = (info: tsModule.server.PluginCreateInfo) => {
    // Get a list of things to remove from the completion list from the config object.
    // If nothing was specified, we'll just remove 'caller'
    const whatToRemove: string[] = info.config.remove || ["caller"];
    // info.project.projectService.logger.msg('test', tsModule.server.Msg.Err)
    // info.project.projectService.logger.info("Vue 3 Plugin is activated");
    // Set up decorator object
    const languageServiceHost = {} as Partial<tsModule.LanguageServiceHost>;

    const logger = info.project.projectService.logger;
    const directory = info.project.getCurrentDirectory();
    const compilerOptions = info.project.getCompilerOptions();

    const languageServiceHostProxy = new Proxy(info.languageServiceHost, {
      get(target, key: keyof tsModule.LanguageServiceHost) {
        return languageServiceHost[key]
          ? languageServiceHost[key]
          : target[key];
      },
    });

    // TypeScript plugins have a `cwd` of `/`, which causes issues with import resolution.
    process.chdir(directory);

    const languageService = ts.createLanguageService(languageServiceHostProxy);

    languageServiceHost.getScriptKind = (fileName) => {
      if (!info.languageServiceHost.getScriptKind) {
        return ts.ScriptKind.Unknown;
      }
      if (isVue(fileName)) {
        logger.info("xxxxx -- fff" + fileName);
        return ts.ScriptKind.TSX;
      }
      return info.languageServiceHost.getScriptKind(fileName);
    };

    // languageServiceHost.getCustomTransformers = (fileName) => {

    // }

    languageServiceHost.getScriptSnapshot = (fileName) => {
      if (isVue(fileName) && fs.existsSync(fileName)) {
        return getDtsSnapshot(
          ts,
          fileName,
          logger
          // compilerOptions,
          // directory
        );
      }
      return info.languageServiceHost.getScriptSnapshot(fileName);
    };

    const createModuleResolver =
      (containingFile: string) =>
      (
        moduleName: string,
        resolveModule: () =>
          | (tsModule.ResolvedModuleWithFailedLookupLocations & {
              failedLookupLocations: readonly string[];
            })
          | undefined
      ): tsModule.ResolvedModuleFull | undefined => {
        // logger.info(
        //   "[[[" +
        //     moduleName +
        //     "| " +
        //     containingFile +
        //     "| " +
        //     isRelativeVue(moduleName) +
        //     "| " +
        //     isVue(moduleName) +
        //     "]]]"
        // );

        if (isRelativeVue(moduleName)) {
          return {
            extension: ts.Extension.Tsx,
            isExternalLibraryImport: false,
            resolvedFileName: path.resolve(
              path.dirname(containingFile),
              moduleName
            ),
          };
        }
        if (!isVue(moduleName)) {
          return;
        }

        const resolvedModule = resolveModule();
        if (!resolvedModule) return;

        const baseUrl = info.project.getCompilerOptions().baseUrl;
        const match = "/index.ts";

        const failedLocations = resolvedModule.failedLookupLocations;
        // Filter to only one extension type, and remove that extension. This leaves us with the actual file name.
        // Example: "usr/person/project/src/dir/File.module.css/index.d.ts" > "usr/person/project/src/dir/File.module.css"
        const normalizedLocations = failedLocations.reduce<string[]>(
          (locations, location) => {
            if (
              (baseUrl ? location.includes(baseUrl) : true) &&
              location.endsWith(match)
            ) {
              return [...locations, location.replace(match, "")];
            }
            return locations;
          },
          []
        );

        // Find the imported CSS module, if it exists.
        const vueModulePath = normalizedLocations.find((location) =>
          fs.existsSync(location)
        );
        if (vueModulePath) {
          logger.info("wwww -- Vue 3 Plugin found path" + vueModulePath);
          return {
            extension: ts.Extension.Tsx,
            isExternalLibraryImport: false,
            resolvedFileName: path.resolve(vueModulePath),
          };
        }

        logger.info("--- Vue 3 Plugin NOT found path" + vueModulePath);

        // const vueModulePath = failedLocations.find(
        //   (x) =>
        //     (baseUrl ? x.includes(baseUrl) : true) &&
        //     x.endsWith(match) &&
        //     fs.existsSync(x)
        // );

        // if (!vueModulePath) return;
        // return {
        //   extension: ts.Extension.Dts,
        //   isExternalLibraryImport: false,
        //   resolvedFileName: path.resolve(vueModulePath),
        // };
      };

    // if (!info.languageServiceHost.resolveModuleNameLiterals) {
    //   info.project.projectService.logger.info("Vue 3 Plugin is not supported");
    //   throw new Error("not supported");
    // }
    // const _resolveModuleNameLiterals =
    //   info.languageServiceHost.resolveModuleNameLiterals.bind(
    //     info.languageServiceHost
    //   );
    // languageServiceHost.resolveModuleNameLiterals = (
    //   moduleNames,
    //   containingFile,
    //   ...rest
    // ) => {
    //   const resolvedModules = _resolveModuleNameLiterals(
    //     moduleNames,
    //     containingFile,
    //     ...rest
    //   );

    //   const moduleResolver = createModuleResolver(containingFile);

    //   return moduleNames.map(({ text: moduleName }, index) => {
    //     try {
    //       const resolvedModule = moduleResolver(
    //         moduleName,
    //         () => resolvedModules[index]
    //       );
    //       if (resolvedModule) return { resolvedModule };
    //     } catch (e) {
    //       logger.info("err" + e);
    //       return resolvedModules[index];
    //     }
    //     return resolvedModules[index];
    //   });
    // };

    // TypeScript 5.x
    if (info.languageServiceHost.resolveModuleNameLiterals) {
      const _resolveModuleNameLiterals =
        info.languageServiceHost.resolveModuleNameLiterals.bind(
          info.languageServiceHost
        );

      languageServiceHost.resolveModuleNameLiterals = (
        moduleNames,
        containingFile,
        ...rest
      ) => {
        const resolvedModules = _resolveModuleNameLiterals(
          moduleNames,
          containingFile,
          ...rest
        );

        const moduleResolver = createModuleResolver(containingFile);

        return moduleNames.map(({ text: moduleName }, index) => {
          try {
            const resolvedModule = moduleResolver(
              moduleName,
              () => resolvedModules[index]
            );
            if (resolvedModule) return { resolvedModule };
          } catch (e) {
            logger.error(e);
            return resolvedModules[index];
          }
          return resolvedModules[index];
        });
      };
    }
    // TypeScript 4.x
    else if (info.languageServiceHost.resolveModuleNames) {
      const _resolveModuleNames =
        info.languageServiceHost.resolveModuleNames.bind(
          info.languageServiceHost
        );

      languageServiceHost.resolveModuleNames = (
        moduleNames,
        containingFile,
        ...rest
      ) => {
        const resolvedModules = _resolveModuleNames(
          moduleNames,
          containingFile,
          ...rest
        );

        const moduleResolver = createModuleResolver(containingFile);

        return moduleNames.map((moduleName, index) => {
          try {
            const resolvedModule = moduleResolver(moduleName, () =>
              languageServiceHost.getResolvedModuleWithFailedLookupLocationsFromCache?.(
                moduleName,
                containingFile
              )
            );
            if (resolvedModule) return resolvedModule;
          } catch (e) {
            logger.error(e);
            return resolvedModules[index];
          }
          return resolvedModules[index];
        });
      };
    }

    // Remove specified entries from completion list
    languageService.getCompletionsAtPosition = (
      fileName,
      position,
      options
    ) => {
      // This is just to let you hook into something to
      // see the debugger working
      debugger;

      logger.info("getCompletionsAtPosition" + fileName + position + options);

      const prior = info.languageService.getCompletionsAtPosition(
        fileName,
        position,
        options
      );
      if (!prior) return;

      const oldLength = prior.entries.length;
      prior.entries = prior.entries.filter(
        (e) => whatToRemove.indexOf(e.name) < 0
      );

      // Sample logging for diagnostic purposes
      if (oldLength !== prior.entries.length) {
        const entriesRemoved = oldLength - prior.entries.length;
        info.project.projectService.logger.info(
          `Removed ${entriesRemoved} entries from the completion list`
        );
      }

      return prior;
    };

    return languageService;
  };

  const getExternalFiles = (project: tsModule.server.ConfiguredProject) => {
    project.projectService.logger.info("Vue 3 Plugin is XX");
    return project.getFileNames(true, true).filter(isVue);
  };
  return {
    create,
    getExternalFiles,
  };
};

export = init;
