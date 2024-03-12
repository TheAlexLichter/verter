import { Range } from "vscode-languageserver-textdocument";
import { WritableDocument } from "./Document";
import { urlToPath } from "../../utils";
import { importVueCompiler } from "../../importPackages";

export class VueDocument extends WritableDocument {
  languageId = "vue";

  get uri() {
    return this._uri;
  }
  get filePath() {
    return this.path;
  }

  private path = urlToPath(this._uri);

  get parsed() {
    return this._parsed;
  }

  private _compiler = importVueCompiler(this._uri);

  private _parsed = this.parseVue();
  constructor(private _uri: string, private content: string) {
    super();
  }

  setText(text: string) {
    this.content = text;
    ++this.version;
    this.lineOffsets = undefined;
    this._parsed = this.parseVue();
  }
  getText(range?: Range | undefined): string {
    if (range) {
      return this.content.substring(
        this.offsetAt(range.start),
        this.offsetAt(range.end)
      );
    }
    return this.content;
  }

  protected parseVue() {
    // TODO add options to parser
    return this._compiler.parse(this.content);
  }
}
