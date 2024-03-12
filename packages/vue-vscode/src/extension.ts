import * as path from "path";
import { window, commands, workspace, ExtensionContext } from "vscode";
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
  RevealOutputChannelOn,
} from "vscode-languageclient/node";

let getClient: (() => LanguageClient) | undefined;

export function activate(context: ExtensionContext) {
  // // The server is implemented in node
  // const serverModule = context.asAbsolutePath(
  //   path.join("server", "out", "server.js")
  // );
  // // If the extension is launched in debug mode then the debug server options are used
  // // Otherwise the run options are used
  // const serverOptions: ServerOptions = {
  //   run: { module: serverModule, transport: TransportKind.ipc },
  //   debug: {
  //     module: serverModule,
  //     transport: TransportKind.ipc,
  //   },
  // };
  // // Options to control the language client
  // const clientOptions: LanguageClientOptions = {
  //   // Register the server for plain text documents
  //   documentSelector: [{ scheme: "file", language: "plaintext" }],
  //   synchronize: {
  //     // Notify the server about file changes to '.clientrc files contained in the workspace
  //     fileEvents: workspace.createFileSystemWatcher("**/.clientrc"),
  //   },
  // };
  // // Create the language client and start the client.
  // client = new LanguageClient(
  //   "languageServerExample",
  //   "Language Server Example",
  //   serverOptions,
  //   clientOptions
  // );
  // // Start the client. This will also launch the server
  // client.start();

  const server = activateVueLanguageServer(context);
  getClient = server.getClient;
}
 
export function deactivate(): Thenable<void> | undefined {
  const stop = getClient?.().stop();
  getClient = undefined;
  return stop;
}

export function activateVueLanguageServer(context: ExtensionContext) {
  const runtimeConfig = workspace.getConfiguration("verter.language-server");

  const { workspaceFolders } = workspace;
  const rootPath = Array.isArray(workspaceFolders)
    ? workspaceFolders[0].uri.fsPath
    : undefined;

  const serverModule = require.resolve(
    "@verter/language-server/dist/server.js"
  );
  console.log("Using server from", serverModule);

  const runExecArgv: string[] = [];
  const port = runtimeConfig.get<number>("port") ?? -1;
  const debugArgs: string[] = [];

  if (port < 0) {
    debugArgs.push("--inspect=6009");
  } else {
    console.log("setting port to", port);
    runExecArgv.push(`--inspect=${port}`);
  }

  debugArgs.push(...runExecArgv);

  // If the extension is launched in debug mode then the debug server options are used
  // Otherwise the run options are used
  const serverOptions: ServerOptions = {
    run: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: { execArgv: runExecArgv },
    },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: { execArgv: debugArgs },
    },
  };

  // Options to control the language client
  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: "file", language: "vue" }],
    revealOutputChannelOn: RevealOutputChannelOn.Never,

    initializationOptions: {
      configuration: {
        vue: workspace.getConfiguration("vue"),
        prettier: workspace.getConfiguration("prettier"),
        emmet: workspace.getConfiguration("emmet"),
        typescript: workspace.getConfiguration("typescript"),
        javascript: workspace.getConfiguration("javascript"),
        css: workspace.getConfiguration("css"),
        less: workspace.getConfiguration("less"),
        scss: workspace.getConfiguration("scss"),
        html: workspace.getConfiguration("html"),
      },
      dontFilterIncompleteCompletions: true,
    },
  };

  let client = createLanguageServer(serverOptions, clientOptions);

  context.subscriptions.push(
    commands.registerCommand("verter.restartLanguageServer", async () => {
      await restartLS(true);
    })
  );

  let restarting = false;
  async function restartLS(showMsg: boolean) {
    if (restarting) {
      return;
    }
    restarting = true;
    try {
      await client.stop();
      client = createLanguageServer(serverOptions, clientOptions);
      await client.start();
      if (showMsg) {
        window.showInformationMessage("Verter Language server restarted");
      }
    } catch (e) {
      console.error(e);
    } finally {
      restarting = false;
    }
  }

  return {
    getClient: () => client,
  };
}

function createLanguageServer(
  serverOptions: ServerOptions,
  clientOptions: LanguageClientOptions
) {
  return new LanguageClient("verter", "Verter", serverOptions, clientOptions);
}
