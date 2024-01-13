import { findVueFiles } from "./finder";
// @ts-expect-error combinePaths is not exported correctly
import { combinePaths, sys } from "typescript";
const PROGRAM_DIR = combinePaths(__dirname, "program");

describe("finder", () => {
  describe("find Vue Files", () => {
    test("it should find all vue files", () => {
      expect(1).toBe(1);
    });

    it("returns all files in the specified folder", () => {
      expect(
        findVueFiles(combinePaths(PROGRAM_DIR, "folder"), sys.readDirectory)
      ).toEqual([
        combinePaths(PROGRAM_DIR, "folder", "Foo.vue"),
        combinePaths(PROGRAM_DIR, "folder", "Random.vue"),
        combinePaths(PROGRAM_DIR, "folder", "Test.vue"),
      ]);
    });

    it("return deep files from packages", () => {
      const directoryFiles = findVueFiles(
        combinePaths(PROGRAM_DIR, "packages"),
        sys.readDirectory
      );

      expect(directoryFiles).toEqual([
        combinePaths(PROGRAM_DIR, "packages", "projA", "test.vue"),
        combinePaths(PROGRAM_DIR, "packages", "projA", "components", "Bar.vue"),

        combinePaths(
          PROGRAM_DIR,
          "packages",
          "projA",
          "components",
          "Foo",
          "Foo.story.vue"
        ),
        combinePaths(
          PROGRAM_DIR,
          "packages",
          "projA",
          "components",
          "Foo",
          "Foo.vue"
        ),
      ]);
    });
  });
});
