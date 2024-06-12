import { compileScript, parse } from "@vue/compiler-sfc";
import { LocationType } from "../../types.js";
import AsyncPlugin from "./index.js";

describe("Slots plugin", () => {
  it("sanitise value", () => {
    expect(AsyncPlugin).toEqual({
      name: "Async",
      walk: expect.any(Function),
    });
  });
  describe("walk", () => {
    describe("undefined", () => {
      test("isSetup: false", () => {
        expect(
          // @ts-expect-error not the right type
          AsyncPlugin.walk(undefined, { isSetup: false })
        ).toBeUndefined();
      });
      test("empty node", () => {
        // @ts-expect-error empty node
        expect(AsyncPlugin.walk({}, { isSetup: true })).toBeUndefined();
      });
    });

    describe('detect cases', ()=> {
      const valid = [
        'await test()',
        'await promise',
        'if(await a) {}',
        
      ]

    })
  });
});
