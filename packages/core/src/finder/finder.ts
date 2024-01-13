import { Program, sys } from "typescript";
export const findVueFiles = (
  dirName: string,
  readDirectory: typeof sys.readDirectory
) => {
  return readDirectory(dirName, [".vue"]);
};
