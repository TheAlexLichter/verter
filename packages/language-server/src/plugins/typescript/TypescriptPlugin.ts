import ts, { ScriptKind } from "typescript";
import Logger from "../../logger";
import { documentManager } from "../../lib/documents/Manager";
import { readFileSync, existsSync } from "node:fs";
import { VueDocument } from "../../lib/documents/VueDocument";
import { findTsConfigPath } from "../../utils";

import path from 'node:path'
import { resolve } from "vscode-languageserver/lib/node/files";

function getScriptFileNames() {
  const d = documentManager.getAllOpened();

  const vueFiles = d.filter(x => x.endsWith('.vue')).map(x => x.replace('file:', 'virtual:')).flatMap(x => [
    x + '.tsx',
    // x + '.template.d.ts',
    // TODO add more blocks
    // x + '.css'
  ])
  // const vueFiles = []



  return d.concat(vueFiles);
}
function getSnapshotIfExists(
  fileName: string
): ts.IScriptSnapshot & { version: number } {
  // if (fileName.endsWith('.vue')) {
  //   fileName = fileName.replace('.vue', '.ts')
  // }

  // if(fileName.endsWith(''))
  // fileName = fileName.replace('Test.vue.d.tsx', 'test.ts')

  // if (fileName.startsWith("file:///")) {
  //   fileName = decodeURIComponent(
  //     fileName.replace("Test.vue", "Test.my.ts").replace("file:///", "")
  //   );
  // }


  if (snapshots.has(fileName)) {
    return snapshots.get(fileName);
  }


  if (fileName.startsWith('virtual:')) {
    const doc = documentManager.getDocument(fileName)!

    const snap = ts.ScriptSnapshot.fromString(doc.template.content);
    snapshots.set(fileName, snap)

    return snap;
  }


  const doc = documentManager.getDocument(fileName);

  let text = doc?.getText() ?? readFileSync(fileName, "utf-8");
  if (fileName.endsWith("Test.my.ts")) {
    text = `atemplate.



declare const atemplate = { 
    a: '1'
} `;
  }
  const snap = ts.ScriptSnapshot.fromString(text);
  snap.version = doc?.version ?? 0;

  snapshots.set(fileName, snap);
  if (doc) {
    snapshots.set(doc?._uri, snap)
  }
  return snap;
}

function fileExists(fileName: string) {
  const e = !!documentManager.getDocument(fileName);
  if (fileName.endsWith("Test.my.ts")) {
    debugger;
    return true;
  }
  console.log("file exists", fileName);
  if (~fileName.indexOf('.vue') || fileName.endsWith('.vue')) {
    // debugger
  }

  if (fileName.startsWith('virtual:')) {
    // debugger
  }

  return e || snapshots.has(fileName) || ts.sys.fileExists(fileName);
}

function readFile(fileName: string) {
  console.log('reading file', fileName)

  if (fileName.startsWith('virtual:')) {
    debugger
  }
  if (fileName.endsWith("Test.my.ts")) {
    return `atemplate.



declare const atemplate = { 
    a: '1'
} `;
  }
  return ts.sys.readFile(fileName);

  //   if (fileExists(fileName)) {
  //   }
  //   const doc = documentManager.getDocument(fileName);
  //   return doc?.getText() ?? "";
}

const snapshots = new Map<string, ts.IScriptSnapshot & { version: number }>();

export function getTypescriptService(workspacePath: string) {

  // console.log('current workspace ', workspacePath)

  // const dd = findTsConfigPath(path.resolve(workspacePath, './tsconfig.json'), [workspacePath], existsSync, e => e);

  const tsConfigStr = readFileSync(path.resolve(workspacePath, './tsconfig.json'), 'utf-8')

  const { config } = ts.parseConfigFileTextToJson(path.resolve(workspacePath, './tsconfig.json'), tsConfigStr)


  const compilerOptions: ts.CompilerOptions = {
    // ...config.compilerOptions,
    // moduleResolution: ts.ModuleResolutionKind.Bundler,
    jsx: ts.JsxEmit.Preserve,
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
    alwaysStrict: true,
    noImplicitAny: true,
    // jsxFactory: 'vue'
    // // jsxFactory: 'vue'
    // "allowJs": true,
    // "checkJs": true,
    // "strictNullChecks": false,
    // "jsxImportSource": "vue",
    // // "moduleResolution": "Bundler",
    // "allowImportingTsExtensions": true
  };

  const tsSystem = ts.sys;

  const host: ts.LanguageServiceHost = {
    log: (message) => Logger.info(`[ts] ${message}`),
    getCompilationSettings: () => compilerOptions,
    getScriptFileNames,
    getScriptVersion: (fileName: string) =>
      getSnapshotIfExists(fileName)?.version?.toString() || "",
    getScriptSnapshot: getSnapshotIfExists,
    getCurrentDirectory: () => workspacePath,
    getDefaultLibFileName: ts.getDefaultLibFilePath,
    fileExists: fileExists,
    readFile: readFile,
    // resolveModuleNames: svelteModuleLoader.resolveModuleNames,
    // readDirectory: svelteModuleLoader.readDirectory,
    // readDirectory: (path, extensions, exclude, include)=> {

    // }
    getDirectories: tsSystem.getDirectories,
    useCaseSensitiveFileNames: () => tsSystem.useCaseSensitiveFileNames,
    getScriptKind: (fileName: string) => {
      const ext = fileName.slice(fileName.lastIndexOf('.'));
      switch (ext.toLowerCase()) {
        case ts.Extension.Js:
          return ts.ScriptKind.JS;
        case ts.Extension.Jsx:
          return ts.ScriptKind.JSX;
        case ts.Extension.Ts:
          return ts.ScriptKind.TS;
        case ts.Extension.Tsx:
          return ts.ScriptKind.TSX;
        case ts.Extension.Json:
          return ts.ScriptKind.JSON;
        default:
          return ts.ScriptKind.Unknown;
      }
    },
    // getProjectVersion: () => projectVersion.toString(),
    getNewLine: () => tsSystem.newLine,
    // resolveTypeReferenceDirectiveReferences:
    //   svelteModuleLoader.resolveTypeReferenceDirectiveReferences,
    // hasInvalidatedResolutions:
    //   svelteModuleLoader.mightHaveInvalidatedResolutions,
    // getModuleResolutionCache: svelteModuleLoader.getModuleResolutionCache,
  };


  // ts.readConfigFile()
  const languageService = ts.createLanguageService(
    host,
    ts.createDocumentRegistry(tsSystem.useCaseSensitiveFileNames),
    // ts.LanguageServiceMode.Semantic
  );


  return languageService;
}
