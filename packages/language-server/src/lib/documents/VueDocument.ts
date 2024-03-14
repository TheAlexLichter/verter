import { Range, TextDocument } from "vscode-languageserver-textdocument";
import { basename } from "path";
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

  fromTextDocument(doc: TextDocument) {
    this.version = doc.version;
    this.content = doc.getText();
    this._parsed = this.parseVue();
    // this.lineCount = doc.lineCount;
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
    const name = basename(this._uri);

    const parsed = this._compiler.parse(this.content, {
      filename: name,
      //   filename: this._uri,
      templateParseOptions: {
        parseMode: "sfc",
      },
    });

    console.log("");

    return parsed;
  }
}
