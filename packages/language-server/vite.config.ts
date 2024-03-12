import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "./src/server.ts",
      fileName: "server",
      formats: ["es"],
    },

    rollupOptions: {
      external: [
        "vscode-languageserver",
        "vscode-languageserver/node.js",
        "vscode-languageserver-protocol",
        "vscode-languageserver/lib/node/main.js",
      ],
      output: {
        esModule: true,
        globals: {
          "vscode-languageserver/node": "vscodeLanguageserver/lib/node/main",
          "vscode-languageserver-protocol": "vscodeLanguageserverProtocol",
        },
      },
    },
  },
});
