import { compileScript, parse } from "@vue/compiler-sfc";
import ImportPlugin from "./index.js";
import { LocationType } from "../types.js";

describe("Generic plugin", () => {
  it("walk should be undefined", () => {
    // @ts-expect-error
    expect(ImportPlugin.walk).toBe(undefined);
  });
});
