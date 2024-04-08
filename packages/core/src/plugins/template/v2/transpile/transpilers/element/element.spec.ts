import { fromTranspiler } from "../spec.helpers";
import Element from "./";

describe("tranpiler element", () => {
  function transpile(
    source: string,
    options?: {
      webComponents: string[];
    }
  ) {
    return fromTranspiler(Element, source, [], options);
  }

  describe("element", () => {
    it("simple", () => {
      const { result } = transpile(`<div></div>`);
      expect(result).toMatchInlineSnapshot(`"<div></div>"`);
    });

    it("self-closing", () => {
      const { result } = transpile(`<div/>`);
      expect(result).toMatchInlineSnapshot(`"<div/>"`);
    });

    it("with children", () => {
      const { result } = transpile(`<div><span>{{text}}</span></div>`);
      expect(result).toMatchInlineSnapshot(
        `"<div><span>{{text}}</span></div>"`
      );
    });
  });

  describe("component", () => {
    it("simple", () => {
      const { result } = transpile(`<my-component></my-component>`);
      expect(result).toMatchInlineSnapshot(
        `"<___VERTER___comp.MyComponent></___VERTER___comp.MyComponent>"`
      );
    });
    it("self-closing", () => {
      const { result } = transpile(`<my-component/>`);
      expect(result).toMatchInlineSnapshot(`"<___VERTER___comp.MyComponent/>"`);
    });

    it("simple camel", () => {
      const { result } = transpile(`<MyComponent></MyComponent>`);
      expect(result).toMatchInlineSnapshot(
        `"<___VERTER___comp.MyComponent></___VERTER___comp.MyComponent>"`
      );
    });
    it("self-closing camel", () => {
      const { result } = transpile(`<MyComponent/>`);
      expect(result).toMatchInlineSnapshot(`"<___VERTER___comp.MyComponent/>"`);
    });

    describe("children", () => {
      it("with children", () => {
        const { result } = transpile(
          `<my-component><span>{{text}}</span></my-component>`
        );
        expect(result).toMatchInlineSnapshot(`
          "<___VERTER___comp.MyComponent v-slot={(ComponentInstance)=>{
          const $slots = ComponentInstance.$slots;
          {___VERTER___SLOT_CALLBACK($slots.default)(()=>{

          <span>{{text}}</span>
          })}

          }}></___VERTER___comp.MyComponent>"
        `);
      });

      it("with component children", () => {
        const { result } = transpile(
          `<my-component><my-span>{{text}}</my-span></my-component>`
        );
        expect(result).toMatchInlineSnapshot(`
          "<___VERTER___comp.MyComponent v-slot={(ComponentInstance)=>{
          const $slots = ComponentInstance.$slots;
          {___VERTER___SLOT_CALLBACK($slots.default)(()=>{

          <___VERTER___comp.MySpan v-slot={(ComponentInstance)=>{
          const $slots = ComponentInstance.$slots;
          {___VERTER___SLOT_CALLBACK($slots.default)(()=>{

          {{text}}
          })}

          }}></___VERTER___comp.MySpan>
          })}

          }}></___VERTER___comp.MyComponent>"
        `);
      });

      it("with #default", () => {
        const { result } = transpile(
          `<my-component><template #default/></my-component>`
        );
        expect(result).toMatchInlineSnapshot(`
          "<___VERTER___comp.MyComponent v-slot={(ComponentInstance)=>{
          const $slots = ComponentInstance.$slots;
          {___VERTER___SLOT_CALLBACK($slots.default)(()=>{

          <___VERTER___template />
          })}

          }}></___VERTER___comp.MyComponent>"
        `);
      });

      it("with v-slot", () => {
        const { result } = transpile(
          `<my-component><template v-slot/></my-component>`
        );
        expect(result).toMatchInlineSnapshot(`
          "<___VERTER___comp.MyComponent v-slot={(ComponentInstance)=>{
          const $slots = ComponentInstance.$slots;
          {___VERTER___SLOT_CALLBACK($slots.default)(()=>{
          <___VERTER___template />
          })}

          }}></___VERTER___comp.MyComponent>"
        `);
      });
      it("with v-slot name", () => {
        const { result } = transpile(
          `<my-component><template v-slot:name/></my-component>`
        );
        expect(result).toMatchInlineSnapshot(`
          "<___VERTER___comp.MyComponent v-slot={(ComponentInstance)=>{
          const $slots = ComponentInstance.$slots;
          {___VERTER___SLOT_CALLBACK($slots.name)(()=>{
          <___VERTER___template />
          })}

          }}></___VERTER___comp.MyComponent>"
        `);
      });

      it("dynamic # name", () => {
        const { result } = transpile(
          `<my-component><template #[bar]/></my-component>`
        );
        expect(result).toMatchInlineSnapshot(`
          "<___VERTER___comp.MyComponent v-slot={(ComponentInstance)=>{
          const $slots = ComponentInstance.$slots;
          {___VERTER___SLOT_CALLBACK($slots[___VERTER___ctx.bar])(()=>{

          <___VERTER___template />
          })}

          }}></___VERTER___comp.MyComponent>"
        `);
      });

      it("dynamic v-slot name", () => {
        const { result } = transpile(
          `<my-component><template v-slot:[bar]/></my-component>`
        );
        expect(result).toMatchInlineSnapshot(`
          "<___VERTER___comp.MyComponent v-slot={(ComponentInstance)=>{
          const $slots = ComponentInstance.$slots;
          {___VERTER___SLOT_CALLBACK($slots[___VERTER___ctx.bar])(()=>{
          <___VERTER___template />
          })}

          }}></___VERTER___comp.MyComponent>"
        `);
      });

      it("with #default=props", () => {
        const { result } = transpile(
          `<my-component><template #default="props"/></my-component>`
        );
        expect(result).toMatchInlineSnapshot(`
          "<___VERTER___comp.MyComponent v-slot={(ComponentInstance)=>{
          const $slots = ComponentInstance.$slots;
          {___VERTER___SLOT_CALLBACK($slots.default)((props)=>{
          <___VERTER___template />
          })}

          }}></___VERTER___comp.MyComponent>"
        `);
      });

      it("with v-slot=props", () => {
        const { result } = transpile(
          `<my-component><template v-slot="props"/></my-component>`
        );
        expect(result).toMatchInlineSnapshot(`
          "<___VERTER___comp.MyComponent v-slot={(ComponentInstance)=>{
          const $slots = ComponentInstance.$slots;
          {___VERTER___SLOT_CALLBACK($slots.default)((props)=>{
          <___VERTER___template />
          })}

          }}></___VERTER___comp.MyComponent>"
        `);
      });
      it("with v-slot name=props", () => {
        const { result } = transpile(
          `<my-component><template v-slot:name="props"/></my-component>`
        );
        expect(result).toMatchInlineSnapshot(`
          "<___VERTER___comp.MyComponent v-slot={(ComponentInstance)=>{
          const $slots = ComponentInstance.$slots;
          {___VERTER___SLOT_CALLBACK($slots.name)((props)=>{
          <___VERTER___template />
          })}

          }}></___VERTER___comp.MyComponent>"
        `);
      });

      it("dynamic # name=props", () => {
        const { result } = transpile(
          `<my-component><template #[bar]="props"/></my-component>`
        );
        expect(result).toMatchInlineSnapshot(`
          "<___VERTER___comp.MyComponent v-slot={(ComponentInstance)=>{
          const $slots = ComponentInstance.$slots;
          {___VERTER___SLOT_CALLBACK($slots[___VERTER___ctx.bar])((props)=>{
          <___VERTER___template />
          })}

          }}></___VERTER___comp.MyComponent>"
        `);
      });

      it("dynamic v-slot name=props", () => {
        const { result } = transpile(
          `<my-component><template v-slot:[bar]="props"/></my-component>`
        );
        expect(result).toMatchInlineSnapshot(`
          "<___VERTER___comp.MyComponent v-slot={(ComponentInstance)=>{
          const $slots = ComponentInstance.$slots;
          {___VERTER___SLOT_CALLBACK($slots[___VERTER___ctx.bar])((props)=>{
          <___VERTER___template />
          })}

          }}></___VERTER___comp.MyComponent>"
        `);
      });

      it("with slot comment", () => {
        const { result } = transpile(
          `<my-component>
          <!-- test -->
          <template #default/>
        </my-component>`
        );
        expect(result).toMatchInlineSnapshot(`
          "<___VERTER___comp.MyComponent v-slot={(ComponentInstance)=>{
          const $slots = ComponentInstance.$slots;
          {___VERTER___SLOT_CALLBACK($slots.default)(()=>{

          <!-- test -->
                    <___VERTER___template />
          })}

          }}>
                    
                  </___VERTER___comp.MyComponent>"
        `);
      });

      it("multiple slots", () => {
        const { result } = transpile(
          `<my-component>
            <template #header/>
            <template #default/>
          </my-component>`
        );
        expect(result).toMatchInlineSnapshot(`
          "<___VERTER___comp.MyComponent v-slot={(ComponentInstance)=>{
          const $slots = ComponentInstance.$slots;
          {___VERTER___SLOT_CALLBACK($slots.header)(()=>{

          <___VERTER___template />
          })}

          {___VERTER___SLOT_CALLBACK($slots.default)(()=>{

          <___VERTER___template />
          })}

          }}>
                      
                      
                    </___VERTER___comp.MyComponent>"
        `);
      });
      it("with slot and implicit default", () => {
        const { result } = transpile(
          `<my-component>
          <template #default/>
          <span>{{test}}</span>
        </my-component>`
        );
        expect(result).toMatchInlineSnapshot(`
          "<___VERTER___comp.MyComponent v-slot={(ComponentInstance)=>{
          const $slots = ComponentInstance.$slots;
          {___VERTER___SLOT_CALLBACK($slots.default)(()=>{


          {___VERTER___SLOT_CALLBACK($slots.default)(()=>{

          <___VERTER___template />
          })}
          <span>{{test}}</span>
          })}

          }}>
                    
                    
                  </___VERTER___comp.MyComponent>"
        `);
      });
      it("implicit default with default", () => {
        const { result } = transpile(
          `<my-component>
          <span>{{test}}</span>
          <template #default/>
        </my-component>`
        );
        expect(result).toMatchInlineSnapshot(`
          "<___VERTER___comp.MyComponent v-slot={(ComponentInstance)=>{
          const $slots = ComponentInstance.$slots;
          {___VERTER___SLOT_CALLBACK($slots.default)(()=>{


          {___VERTER___SLOT_CALLBACK($slots.default)(()=>{

          <___VERTER___template />
          })}
          <span>{{test}}</span>
          })}

          }}>
                    
                    
                  </___VERTER___comp.MyComponent>"
        `);
      });
      it("implicit default + comment and default", () => {
        const { result } = transpile(
          `<my-component>
          <span>{{test}}</span>
          <!-- test -->
          <template #default/>
        </my-component>`
        );
        expect(result).toMatchInlineSnapshot(`
          "<___VERTER___comp.MyComponent v-slot={(ComponentInstance)=>{
          const $slots = ComponentInstance.$slots;
          {___VERTER___SLOT_CALLBACK($slots.default)(()=>{


          {___VERTER___SLOT_CALLBACK($slots.default)(()=>{

          <!-- test -->
                    <___VERTER___template />
          })}
          <span>{{test}}</span>
          })}

          }}>
                    
                    
                  </___VERTER___comp.MyComponent>"
        `);
      });
    });
  });

  describe("webcomponent", () => {
    it("simple", () => {
      const { result } = transpile(`<my-component> </my-component>`, {
        webComponents: ["my-component"],
      });
      expect(result).toMatchInlineSnapshot(`"<my-component> </my-component>"`);
    });
    it("self-closing", () => {
      const { result } = transpile(`<my-component/>`, {
        webComponents: ["my-component"],
      });
      expect(result).toMatchInlineSnapshot(`"<my-component/>"`);
    });

    it("different casing", () => {
      const { result } = transpile(`<my-component> </my-component>`, {
        webComponents: ["MyComponent"],
      });
      expect(result).toMatchInlineSnapshot(`"<my-component> </my-component>"`);
    });
  });

  describe("attributes", () => {
    it("simple", () => {
      const { result } = transpile(`<div test="hello"></div>`);
      expect(result).toMatchInlineSnapshot(`"<div test="hello"></div>"`);
    });

    it("self-closing", () => {
      const { result } = transpile(`<div test="hello"/>`);
      expect(result).toMatchInlineSnapshot(`"<div test="hello"/>"`);
    });

    it("with children", () => {
      const { result } = transpile(
        `<div test="hello"><span test="hello">{{text}}</span></div>`
      );
      expect(result).toMatchInlineSnapshot(
        `"<div test="hello"><span test="hello">{{text}}</span></div>"`
      );
    });

    it("camelcasing", () => {
      const { result } = transpile(`<slot test-prop="hello"/>`);
      expect(result).toMatchInlineSnapshot(
        `"<___VERTER___slot testProp="hello"/>"`
      );
    });

    it("not camelcasing elemenet", () => {
      const { result } = transpile(`<div test-prop="hello"/>`);
      expect(result).toMatchInlineSnapshot(`"<div test-prop="hello"/>"`);
    });
  });

  describe("directives", () => {
    describe("binding", () => {
      it("props w/:", () => {
        const { result } = transpile(`<span :foo="bar"/>`);

        expect(result).toMatchInlineSnapshot(
          `"<span foo={___VERTER___ctx.bar}/>"`
        );
      });

      it("props w/v-bind:", () => {
        const { result } = transpile(`<span v-bind:foo="bar"/>`);

        expect(result).toMatchInlineSnapshot(
          `"<span foo={___VERTER___ctx.bar}/>"`
        );
      });

      it("v-bind", () => {
        const { result } = transpile(`<span v-bind="bar"/>`);

        expect(result).toMatchInlineSnapshot(
          `"<span {...___VERTER___ctx.bar}/>"`
        );
      });

      it("binding with :bind", () => {
        const { result } = transpile(`<span :bind="bar"/>`);

        expect(result).toMatchInlineSnapshot(
          `"<span bind={___VERTER___ctx.bar}/>"`
        );
      });
      it("binding multi-line", () => {
        const { result } = transpile(`<span :bind="
            i == 1 ? false : true
            "/>`);
        expect(result).toMatchInlineSnapshot(`
          "<span bind={
                      ___VERTER___ctx.i == 1 ? false : true
                      }/>"
        `);
      });

      it("binding boolean", () => {
        const { result } = transpile(`<span :bind="false"/>`);

        expect(result).toMatchInlineSnapshot(`"<span bind={false}/>"`);
      });

      it("binding with v-bind:bind", () => {
        const { result } = transpile(`<span v-bind:bind="bar"/>`);

        expect(result).toMatchInlineSnapshot(
          `"<span bind={___VERTER___ctx.bar}/>"`
        );
      });

      it("v-bind + props", () => {
        const { result } = transpile(`<span v-bind="bar" foo="bar"/>`);

        expect(result).toMatchInlineSnapshot(
          `"<span {...___VERTER___ctx.bar} foo="bar"/>"`
        );
      });

      it("props + v-bind", () => {
        const { result } = transpile(`<span foo="bar" v-bind="bar"/>`);

        expect(result).toMatchInlineSnapshot(
          `"<span foo="bar" {...___VERTER___ctx.bar}/>"`
        );
      });

      it("props + binding on array", () => {
        const { result } = transpile(`<span :foo="[bar]" />`);

        expect(result).toMatchInlineSnapshot(
          `"<span foo={[___VERTER___ctx.bar]} />"`
        );
      });

      it("props + binding complex", () => {
        const { result } = transpile(
          `<span :foo="isFoo ? { myFoo: foo } : undefined" />`
        );

        expect(result).toMatchInlineSnapshot(
          `"<span foo={___VERTER___ctx.isFoo ? { myFoo: ___VERTER___ctx.foo } : undefined} />"`
        );
      });

      it("should keep casing", () => {
        const { result } = transpile(`<span aria-autocomplete="bar"/>`);

        expect(result).toMatchInlineSnapshot(
          `"<span aria-autocomplete="bar"/>"`
        );
      });

      it("should keep casing on binding", () => {
        const { result } = transpile(`<span :aria-autocomplete="'bar'"/>`);

        expect(result).toMatchInlineSnapshot(
          `"<span aria-autocomplete={'bar'}/>"`
        );
      });

      it("should pass boolean on just props", () => {
        const { result } = transpile(`<span foo/>`);

        expect(result).toMatchInlineSnapshot(`"<span foo/>"`);
      });

      it("should not camelCase props", () => {
        const { result } = transpile(`<span supa-awesome-prop="hello"></span>`);

        expect(result).toMatchInlineSnapshot(
          `"<span supa-awesome-prop="hello"></span>"`
        );
      });

      it("v-bind", () => {
        const { result } = transpile(`<div v-bind="props" />`);

        expect(result).toMatchInlineSnapshot(
          `"<div {...___VERTER___ctx.props} />"`
        );
      });
      it("v-bind name", () => {
        const { result } = transpile(`<div v-bind:name="props" />`);

        expect(result).toMatchInlineSnapshot(
          `"<div name={___VERTER___ctx.props} />"`
        );
      });

      it("v-bind :short", () => {
        const { result } = transpile(`<div :name />`);

        expect(result).toMatchInlineSnapshot(
          `"<div name={___VERTER___ctx.name} />"`
        );
      });
      it("v-bind :short camelise", () => {
        const { result } = transpile(`<MyComp :foo-bar />`);

        expect(result).toMatchInlineSnapshot(
          `"<___VERTER___comp.MyComp fooBar={___VERTER___ctx.fooBar} />"`
        );
      });

      it("v-bind :shorter", () => {
        const { result } = transpile(`<div :name="name" />`);

        expect(result).toMatchInlineSnapshot(
          `"<div name={___VERTER___ctx.name} />"`
        );
      });

      it("bind arrow function", () => {
        const { result } = transpile(`<div :name="()=>name" />`);

        expect(result).toMatchInlineSnapshot(
          `"<div name={()=>___VERTER___ctx.name} />"`
        );
      });

      it("bind arrow function with return ", () => {
        const { result } = transpile(`<div :name="()=>{ return name }" />`);

        expect(result).toMatchInlineSnapshot(
          `"<div name={()=>{ return ___VERTER___ctx.name }} />"`
        );
      });

      it("bind with ?.", () => {
        const { result } = transpile(`<div :name="test?.random" />`);

        expect(result).toMatchInlineSnapshot(
          `"<div name={___VERTER___ctx.test?.random} />"`
        );
      });

      it("should append ctx inside of functions", () => {
        const { result } = transpile(
          `<span :check-for-something="e=> { foo = e }"></span>`
        );

        expect(result).toMatchInlineSnapshot(
          `"<span checkForSomething={e=> { ___VERTER___ctx.foo = e }}></span>"`
        );
      });

      it("should  append ctx inside a string interpolation", () => {
        const { result } = transpile(
          '<span :check-for-something="`foo=${bar}`"></span>'
        );

        expect(result).toMatchInlineSnapshot(
          `"<span checkForSomething={\`foo=\${___VERTER___ctx.bar}\`}></span>"`
        );
      });

      describe("class & style merge", () => {
        it("should do class merge", () => {
          const { result } = transpile(
            `<span class="foo" :class="['hello']"></span>`
          );
          expect(result).toMatchInlineSnapshot(
            `"<span  class={___VERTER___normalizeClass([['hello'],"foo"])}></span>"`
          );
        });

        it("should do class merge on bind sugar short", () => {
          const { result } = transpile(`<span class="foo" :class></span>`);

          expect(result).toMatchInlineSnapshot(
            `"<span  class={___VERTER___normalizeClass([___VERTER___ctx.class},"foo"])></span>"`
          );
        });

        it("should do class merge with v-bind", () => {
          const { result } = transpile(
            `<span class="foo" :class="['hello']" v-bind:class="{'oi': true}"></span>`
          );
          expect(result).toMatchInlineSnapshot(
            `"<span  class={___VERTER___normalizeClass([['hello'],"foo",{'oi': true}])} ></span>"`
          );
        });

        it("should do class merge with v-bind with attributes in between", () => {
          const { result } = transpile(
            `<span class="foo" don-t :class="['hello']" v-bind:class="{'oi': true}"></span>`
          );

          expect(result).toMatchInlineSnapshot(
            `"<span  don-t class={___VERTER___normalizeClass([['hello'],"foo",{'oi': true}])} ></span>"`
          );
        });

        it("should still append context accessor", () => {
          const { result } = transpile(
            `<span :class="foo" don-t :class="['hello', bar]" v-bind:class="{'oi': true, sup}"></span>`
          );

          expect(result).toMatchInlineSnapshot(
            `"<span class={___VERTER___normalizeClass([___VERTER___ctx.foo,['hello', ___VERTER___ctx.bar],{'oi': true, sup:___VERTER___ctx.sup}])} don-t  ></span>"`
          );
        });

        it("should do style merge", () => {
          const { result } = transpile(
            `<span style="foo" :style="['hello']"></span>`
          );

          expect(result).toMatchInlineSnapshot(
            `"<span  style={___VERTER___normalizeStyle([['hello'],"foo"])}></span>"`
          );
        });
        it("should do style merge with v-bind ", () => {
          const { result } = transpile(
            `<span style="foo" :style="['hello']" v-bind:style="{'oi': true}"></span>`
          );

          expect(result).toMatchInlineSnapshot(
            `"<span  style={___VERTER___normalizeStyle([['hello'],"foo",{'oi': true}])} ></span>"`
          );
        });
        it("should do style merge with v-bind with attributes in between", () => {
          const { result } = transpile(
            `<span style="foo" don-t :style="['hello']" v-bind:style="{'oi': true}"></span>`
          );

          expect(result).toMatchInlineSnapshot(
            `"<span  don-t style={___VERTER___normalizeStyle([['hello'],"foo",{'oi': true}])} ></span>"`
          );
        });

        it("should still append context accessor style", () => {
          const { result } = transpile(
            `<span :style="foo" don-t :style="['hello', bar]" v-bind:style="{'oi': true, sup}"></span>`
          );

          expect(result).toMatchInlineSnapshot(
            `"<span style={___VERTER___normalizeStyle([___VERTER___ctx.foo,['hello', ___VERTER___ctx.bar],{'oi': true, sup:___VERTER___ctx.sup}])} don-t  ></span>"`
          );
        });

        it("should append context on objects shothand", () => {
          const { result } = transpile(`<span :style="{colour}"></span>`);

          expect(result).toMatchInlineSnapshot(
            `"<span style={{colour:___VERTER___ctx.colour}}></span>"`
          );
        });

        it("should append context on objects", () => {
          const { result } = transpile(
            `<span :style="{colour: myColour}"></span>`
          );

          expect(result).toMatchInlineSnapshot(
            `"<span style={{colour: ___VERTER___ctx.myColour}}></span>"`
          );
        });

        it("should append context on dynamic accessor", () => {
          const { result } = transpile(
            `<span :style="{[colour]: true}"></span>`
          );

          expect(result).toMatchInlineSnapshot(
            `"<span style={{[___VERTER___ctx.colour]: true}}></span>"`
          );
        });

        it("should append context on dynamic accessor + value", () => {
          const { result } = transpile(
            `<span :style="{[colour]: myColour}"></span>`
          );

          expect(result).toMatchInlineSnapshot(
            `"<span style={{[___VERTER___ctx.colour]: ___VERTER___ctx.myColour}}></span>"`
          );
        });
      });
    });

    describe("on", () => {
      it("should add event correctly", () => {
        const { result } = transpile(`<span @back="navigateToSession(null)"/>`);

        expect(result).toMatchInlineSnapshot(
          `"<span onBack={___VERTER___ctx.navigateToSession(null)}/>"`
        );
      });
      it('should camelCase "on" event listeners', () => {
        const { result } = transpile(
          `<span @check-for-something="test"></span>`
        );

        expect(result).toMatchInlineSnapshot(
          `"<span onCheckForSomething={___VERTER___ctx.test}></span>"`
        );
      });

      it("should append ctx inside of functions", () => {
        const { result } = transpile(
          `<span @check-for-something="e=> { foo = e }"></span>`
        );

        expect(result).toMatchInlineSnapshot(
          `"<span onCheckForSomething={e=> { ___VERTER___ctx.foo = e }}></span>"`
        );
      });
    });
  });
});
