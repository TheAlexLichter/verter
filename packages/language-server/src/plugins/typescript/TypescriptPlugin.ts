import ts, { ScriptKind } from "typescript";
import Logger from "../../logger";
import { documentManager } from "../../lib/documents/Manager";
import { readFileSync } from "node:fs";

function getScriptFileNames() {
  const d = documentManager.getAllOpened();
  return d.concat(
    ...d.map((x) =>
      decodeURIComponent(
        x.replace("Test.vue", "Test.my.ts").replace("file:///", "")
      )
    )
  );
}
function getSnapshotIfExists(
  fileName: string
): ts.IScriptSnapshot & { version: number } {
  if (fileName.startsWith("file:///")) {
    fileName = decodeURIComponent(
      fileName.replace("Test.vue", "Test.my.ts").replace("file:///", "")
    );
  }
  if (snapshots.has(fileName)) {
    return snapshots.get(fileName);
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
  return snap;
}

function fileExists(fileName: string) {
  const e = !!documentManager.getDocument(fileName);
  if (fileName.endsWith("Test.my.ts")) {
    debugger;
    return true;
  }
  console.log("file exists", fileName);

  return e || snapshots.has(fileName) || ts.sys.fileExists(fileName);
}

function readFile(fileName: string) {
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
  const compilerOptions: ts.CompilerOptions = {};

  const tsSystem = ts.sys;

  const host: ts.LanguageServiceHost = {
    log: (message) => Logger.info(`[ts] ${message}`),
    getCompilationSettings: () => compilerOptions,
    getScriptFileNames,
    getScriptVersion: (fileName: string) =>
      getSnapshotIfExists(fileName)?.version.toString() || "",
    getScriptSnapshot: getSnapshotIfExists,
    getCurrentDirectory: () => workspacePath,
    getDefaultLibFileName: ts.getDefaultLibFilePath,
    fileExists: fileExists,
    readFile: readFile,
    // readFile: svelteModuleLoader.readFile,
    // resolveModuleNames: svelteModuleLoader.resolveModuleNames,
    // readDirectory: svelteModuleLoader.readDirectory,
    getDirectories: tsSystem.getDirectories,
    useCaseSensitiveFileNames: () => tsSystem.useCaseSensitiveFileNames,
    getScriptKind: (fileName: string) => ScriptKind.TSX,
    // getProjectVersion: () => projectVersion.toString(),
    getNewLine: () => tsSystem.newLine,
    // resolveTypeReferenceDirectiveReferences:
    //   svelteModuleLoader.resolveTypeReferenceDirectiveReferences,
    // hasInvalidatedResolutions:
    //   svelteModuleLoader.mightHaveInvalidatedResolutions,
    // getModuleResolutionCache: svelteModuleLoader.getModuleResolutionCache,
  };
  const languageService = ts.createLanguageService(
    host,
    ts.createDocumentRegistry()
  );

  return languageService;
}
