// import { generateScript } from "../dist/index.js";
import { createBuilder } from "../dist/builder.js";
import { glob } from "glob";
import { dirname, basename } from "path";
import fs from "fs-extra";
import { parse } from "@vue/compiler-sfc";

const mainDir = "D:/dev/hypermob/judis-app/packages";

const genFiles = glob.sync(`${mainDir}/**/*.vue`);

// console.log("gen", genFiles);

// const dirs = genFiles.map((f) => dirname(f));

// console.log("dirs", dirs);

const builder = createBuilder();

async function processDir(file) {
  const name = basename(file, ".vue");
  const path = dirname(file);

  const [compFile] = await Promise.all([fs.readFile(file, "utf8")]);

  const outputFilePath = `.\\generated\\_dir\\${path.replace(
    "D:\\",
    ""
  )}\\${name}.ts`;

  // const parsed = parse(compFile, {
  //   filename: "Comp.vue",
  //   templateParseOptions: {},
  // });
  //   console.log('parsed', parsed)
  const output = builder.process(basename(file), compFile);
  // .replace(
  //   "export default __options as __COMP__",
  //   "const Comp = __options as any as __COMP__;"
  // );

  await fs.outputFile(outputFilePath, output, {
    encoding: "utf8",
    // flag: "w",
  });
}

await Promise.all(genFiles.map(processDir));
