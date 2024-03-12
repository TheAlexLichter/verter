// import lsp from "vscode-languageserver/lib/node/main.js";
import lsp from "vscode-languageserver/node.js";
import Logger from "./logger";

export interface LsConnectionOption {
  /**
   * The connection to use. If not provided, a new connection will be created.
   */
  connection?: lsp.Connection;

  logErrorsOnly?: boolean;
}

export function startServer(options: LsConnectionOption = {}) {
  Logger.error("in startServer", options);
  //   const connection = lsp.createConnection(lsp.ProposedFeatures.all);

  let connection = options.connection;
  if (!connection) {
    if (process.argv.includes("--stdio")) {
      console.log = console.warn;
      connection = lsp.createConnection(process.stdin, process.stdout);
    } else {
      connection = lsp.createConnection(lsp.ProposedFeatures.all);
      // new lsp.IPCMessageReader(process),
      // new lsp.IPCMessageWriter(process)
      // );
    }
  }

  if (options?.logErrorsOnly !== undefined) {
    Logger.setLogErrorsOnly(options.logErrorsOnly);
  }

  connection.onInitialized(() => {
    console.log("inited XXX--- lOL");
    debugger;
  });

  connection.onInitialize((e) => {
    console.log("inited --- lOL");
    debugger;
  });

  console.log("should be listening now...");
  connection.listen();
}
startServer();
