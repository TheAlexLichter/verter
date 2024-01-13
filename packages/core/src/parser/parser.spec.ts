import {
  createProgram,
  combinePaths,
  createCompilerHost,
  createSourceFile,
  ScriptTarget,
  DiagnosticCategory,
  factory
} from "typescript";
import { parseSFC, parserFiler, templateToJSX } from "./parser";

describe("test", () => {
  test("it should parse", () => {
    expect(
      parseSFC(
        `<template><div>test</div></template><script setup> import { ref } from 'vue'; const a = ref('')</script>`
      )
    ).toMatchInlineSnapshot(`
      {
        "descriptor": {
          "cssVars": [],
          "customBlocks": [],
          "filename": "test.vue",
          "script": null,
          "scriptSetup": {
            "attrs": {
              "setup": true,
            },
            "content": " import { ref } from 'vue'; const a = ref('')",
            "loc": {
              "end": {
                "column": 96,
                "line": 1,
                "offset": 95,
              },
              "source": " import { ref } from 'vue'; const a = ref('')",
              "start": {
                "column": 51,
                "line": 1,
                "offset": 50,
              },
            },
            "setup": true,
            "type": "script",
          },
          "shouldForceReload": [Function],
          "slotted": false,
          "source": "<template><div>test</div></template><script setup> import { ref } from 'vue'; const a = ref('')</script>",
          "styles": [],
          "template": {
            "ast": {
              "children": [
                {
                  "children": [
                    {
                      "content": "test",
                      "loc": {
                        "end": {
                          "column": 20,
                          "line": 1,
                          "offset": 19,
                        },
                        "source": "test",
                        "start": {
                          "column": 16,
                          "line": 1,
                          "offset": 15,
                        },
                      },
                      "type": 2,
                    },
                  ],
                  "codegenNode": undefined,
                  "isSelfClosing": false,
                  "loc": {
                    "end": {
                      "column": 26,
                      "line": 1,
                      "offset": 25,
                    },
                    "source": "<div>test</div>",
                    "start": {
                      "column": 11,
                      "line": 1,
                      "offset": 10,
                    },
                  },
                  "ns": 0,
                  "props": [],
                  "tag": "div",
                  "tagType": 0,
                  "type": 1,
                },
              ],
              "codegenNode": undefined,
              "isSelfClosing": false,
              "loc": {
                "end": {
                  "column": 37,
                  "line": 1,
                  "offset": 36,
                },
                "source": "<template><div>test</div></template>",
                "start": {
                  "column": 1,
                  "line": 1,
                  "offset": 0,
                },
              },
              "ns": 0,
              "props": [],
              "tag": "template",
              "tagType": 0,
              "type": 1,
            },
            "attrs": {},
            "content": "<div>test</div>",
            "loc": {
              "end": {
                "column": 26,
                "line": 1,
                "offset": 25,
              },
              "source": "<div>test</div>",
              "start": {
                "column": 11,
                "line": 1,
                "offset": 10,
              },
            },
            "map": {
              "file": "test.vue",
              "mappings": "AAAA,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC",
              "names": [],
              "sourceRoot": "",
              "sources": [
                "test.vue",
              ],
              "sourcesContent": [
                "<template><div>test</div></template><script setup> import { ref } from 'vue'; const a = ref('')</script>",
              ],
              "version": 3,
            },
            "type": "template",
          },
        },
        "errors": [],
      }
    `);
  });

  describe("parser", () => {
    const getParsed = (
      fileName: string,
      content: string,
      additionalFiles: Map<string, string> = new Map<string, string>()
    ) => {
      const program = createProgram({
        rootNames: [fileName, ...additionalFiles.keys()],
        options: {},
        host: {
          ...createCompilerHost({}),
          fileExists: (path: string) =>
            additionalFiles.has(path) || path === fileName,
          readFile: (path: string) => additionalFiles.get(path) ?? content,
          getSourceFile: (path: string) => {
            console.log("file", path);
            if (path === fileName || additionalFiles.has(path)) {
              return createSourceFile(
                path,
                additionalFiles.get(path) ?? content,
                ScriptTarget.ESNext
              );
            }
          },
        },
      });
      console.log("ssad", program.getCompilerOptions());
      // program.  const extensions = program.getSupportedExtensionsWithJsonIfResolveJsonModule(
      //   program?.getCompilerOptions(),
      //   getSupportedExtensions(program?.getCompilerOptions())
      // ).flat();

      return parserFiler({
        sourceFile: program.getSourceFile(fileName)!,
        checker: program.getTypeChecker(),
      });
    };
    it("should throw on invalid file extension", () => {
      expect(() => getParsed("test.ts", "const a = 1;")).toThrowError(
        new Error("Don't call me")
      );
    });
    it("should parse", () => {
      expect(getParsed("test.vue", "const a = 1;")).toThrowError(
        new Error("Don't call me")
      );
    });
    it.only("mmm", () => {
      const program = createProgram({
        rootNames: ["test.vue"],
        options: {},
      });

      const rr = templateToJSX(
        parseSFC(`<template><div>test</div></template>`).descriptor.template,
        factory
      );

      console.log("rrr", rr);
    });
  });
});
