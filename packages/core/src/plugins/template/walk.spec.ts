import { MagicString, parse } from "@vue/compiler-sfc";
import { walkAttribute, walkElement } from "./walk.js";
import { ElementNode } from "@vue/compiler-core";

describe("walk", () => {
  describe("walkElement", () => {});

  describe("walkAttribute", () => {
    describe("attribute", () => {});

    describe("directive", () => {
      describe("v-for", () => {
        function parseAndWalk(source: string) {
          const parsed = parse(`<template>${source}</template>`);
          const str = new MagicString(source);
          const res = walkElement(
            parsed.descriptor.template!.ast!.children![0] as ElementNode,
            str
          );
          return res;
        }

        it("simple", () => {
          const source = `<li v-for="item in items"></li>`;

          const res = parseAndWalk(source);
          expect(res).toMatchInlineSnapshot(
            `"{ renderList(items, (item) => { <li ></li> }) }"`
          );
        });

        it("destructing", () => {
          const source = `<li v-for="{ message } in items"></li>`;
          const res = parseAndWalk(source);
          expect(res).toMatchInlineSnapshot(
            `"{ renderList(items, ({ message }) => { <li ></li> }) }"`
          );
        });

        it("index", () => {
          const source = `<li v-for="(item, index) in items"></li>`;
          const res = parseAndWalk(source);
          expect(res).toMatchInlineSnapshot(
            `"{ renderList(items, (item, index) => { <li ></li> }) }"`
          );
        });

        it("index + key", () => {
          const source = `<li v-for="(item, index) in items" :key="index + 'random'"></li>`;
          const res = parseAndWalk(source);
          expect(res).toMatchInlineSnapshot(
            `"{ renderList(items, (item, index) => { <li key={index + 'random'}></li> }) }"`
          );
        });

        it("destructing + index", () => {
          const source = `<li v-for="({ message }, index) in items"></li>`;
          const res = parseAndWalk(source);
          expect(res).toMatchInlineSnapshot(
            `"{ renderList(items, ({ message }, index) => { <li ></li> }) }"`
          );
        });

        it("nested", () => {
          const source = `<li v-for="item in items">
    <span v-for="childItem in item.children"></span>
</li>`;
          const res = parseAndWalk(source);
          expect(res).toMatchInlineSnapshot(
            `"{ renderList(items, (item) => { <li >{ renderList(item.children, (childItem) => { <span ></span> }) }</li> }) }"`
          );
        });

        it("of", () => {
          const source = `<li v-for="item of items"></li>`;
          const res = parseAndWalk(source);
          expect(res).toMatchInlineSnapshot(
            `"{ renderList(items, (item) => { <li ></li> }) }"`
          );
        });

        // object

        it("object", () => {
          const source = `<li v-for="value in myObject"></li>`;
          const res = parseAndWalk(source);
          expect(res).toMatchInlineSnapshot(
            `"{ renderList(myObject, (value) => { <li ></li> }) }"`
          );
        });

        it("object + key", () => {
          const source = `<li v-for="(value, key) in myObject"></li>`;
          const res = parseAndWalk(source);
          expect(res).toMatchInlineSnapshot(
            `"{ renderList(myObject, (value, key) => { <li ></li> }) }"`
          );
        });

        it("object + key + index", () => {
          const source = `<li v-for="(value, key, index) in myObject"></li>`;
          const res = parseAndWalk(source);
          expect(res).toMatchInlineSnapshot(
            `"{ renderList(myObject, (value, key, index) => { <li ></li> }) }"`
          );
        });

        // range
        it("range", () => {
          const source = `<li v-for="n in 10"></li>`;
          const res = parseAndWalk(source);
          expect(res).toMatchInlineSnapshot(
            `"{ renderList(10, (n) => { <li ></li> }) }"`
          );
        });

        // v-if has higher priority than v-for
        it("v-if", () => {
          const source = `<li v-for="i in n" v-if="n > 5"></li>`;
          const res = parseAndWalk(source);
          expect(res).toMatchInlineSnapshot(
            `"{ if ( n > 5 ){ { renderList(n, (i) => { <li ></li> }) } } }"`
          );
        });
      });
    });
  });
});
