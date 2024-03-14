// Handles Vue Documents

import { TextDocument } from "vscode-languageserver-textdocument";
import { VueDocument } from "./VueDocument";

export class VueDocumentManager {
  private readonly _documents = new Map<string, VueDocument>();
  private readonly _activeDocuments = new Set<string>();

  public openDocument(doc: TextDocument) {
    let vueDoc = this._documents.get(doc.uri);
    if (vueDoc) {
      vueDoc.fromTextDocument(doc);
    } else {
      vueDoc = new VueDocument(doc.uri, doc.getText());
      this._documents.set(doc.uri, vueDoc);
    }
    this._activeDocuments.add(doc.uri);
    return vueDoc;
  }
  public closeDocument(uri: string) {
    this._activeDocuments.delete(uri);
  }

  public isOpen(uri: string) {
    return this._activeDocuments.has(uri);
  }

  /**
   * Deletes the document from the manager
   * @param uri
   */
  public removeDocument(uri: string) {
    return this._documents.delete(uri);
  }
}
