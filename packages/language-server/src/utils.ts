import { URI } from "vscode-uri";

export function pathToUrl(path: string) {
  return URI.file(path).toString();
}

export function urlToPath(stringUrl: string): string | null {
    const url = URI.parse(stringUrl);
    if (url.scheme !== 'file') {
        return null;
    }
    return url.fsPath.replace(/\\/g, '/');
}