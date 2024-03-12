import { TextDocument } from "vscode-languageserver-textdocument";
import type { Position, Range } from "vscode-languageserver-textdocument";
import { getLineOffsets, offsetAt, positionAt } from "./utils";

// based on https://github.com/sveltejs/language-tools/blob/ceb4f7065e4471d75fac7c0191ec7ad67446e81f/packages/language-server/src/lib/documents/DocumentBase.ts
export abstract class ReadableDocument implements TextDocument {
  abstract get languageId(): string;
  abstract get uri(): string;

  version: number = 0;
  get lineCount() {
    return this.getText().split(/\r?\n/).length;
  }
  abstract getText(range?: Range | undefined): string;

  /**
   * Should be cleared when there's an update to the text
   */
  protected lineOffsets?: number[];

  positionAt(offset: number): Position {
    return positionAt(offset, this.getText(), this.getLineOffsets());
  }
  offsetAt(position: Position): number {
    return offsetAt(position, this.getText(), this.getLineOffsets());
  }

  private getLineOffsets() {
    if (!this.lineOffsets) {
      this.lineOffsets = getLineOffsets(this.getText());
    }
    return this.lineOffsets;
  }
}

export abstract class WritableDocument extends ReadableDocument {
  /**
   * Set the text content of the document.
   * Implementers should set `lineOffsets` to `undefined` here.
   * @param text The new text content
   */
  abstract setText(text: string): void;

  /**
   * Update the text between two positions.
   * @param text The new text slice
   * @param start Start offset of the new text
   * @param end End offset of the new text
   */
  update(text: string, start: number, end: number): void {
    this.lineOffsets = undefined;
    const content = this.getText();
    this.setText(content.slice(0, start) + text + content.slice(end));
  }
}
