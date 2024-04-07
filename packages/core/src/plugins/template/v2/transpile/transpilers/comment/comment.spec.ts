import { fromTranspiler } from "../spec.helpers";
import Comment from "./";

describe("tranpiler comment", () => {
  function transpile(source: string) {
    return fromTranspiler(Comment, source);
  }

  it("transpile single line comment", () => {
    const source = `<!-- this is comment -->`;
    const { result } = transpile(source);

    expect(result).toBe(`{/* this is comment */}`);
  });

  it("multi line comment", () => {
    const source = `<!-- this is comment
    with multi lines


    -->`;
    const { result } = transpile(source);
    expect(result).toMatchInlineSnapshot(`
      "{/* this is comment
          with multi lines


          */}"
    `);
  });

  it("multiple comments", () => {
    const source = `<!-- this is comment -->
    
    <!-- this is another comment -->
    <!-- this is the last comment -->
`;
    const { result } = transpile(source);

    expect(result).toMatchInlineSnapshot(`
      "{/* this is comment */}
          
          {/* this is another comment */}
          {/* this is the last comment */}
      "
    `);
  });

  it("with siblings", () => {
    const source = `<!-- this is comment -->
    
    <div> {{ test }} </div>
    <!-- this is the last comment -->
`;
    const { result } = transpile(source);

    expect(result).toMatchInlineSnapshot(`
      "{/* this is comment */}
          
          <div> {{ test }} </div>
          {/* this is the last comment */}
      "
    `);
  });
});
