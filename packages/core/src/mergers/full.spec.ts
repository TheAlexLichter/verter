import { MagicString } from "@vue/compiler-sfc";
import { createBuilder } from "../builder"
import { mergeFull } from "./full"
import fs from 'node:fs'


describe('Mergers Full', () => {

    function testSourceMaps({ content, map }: {
        content: string,
        map: ReturnType<MagicString["generateMap"]>
    }
    ) {
        fs.writeFileSync(
            "D:/Downloads/sourcemap-test/sourcemap-example.js",
            content,
            "utf-8"
        );
        fs.writeFileSync(
            "D:/Downloads/sourcemap-test/sourcemap-example.js.map",
            JSON.stringify(map),
            "utf-8"
        );
    }


    const builder = createBuilder()
    function process(content: string, fileName = 'test.vue') {
        const { locations, context } = builder.preProcess(fileName, content, true)
        return mergeFull(locations, context)
    }


    it.only('should work options API', () => {
        const source = `<script>
        export default {
            data(){
                return { test: 'hello' }
            }
        }
        </script>
        <template>
            <div>test</div>
        </template>`

        const p = process(source)

        expect(p.source).toBe(source)

        p.map
        testSourceMaps(p)
    })

    it('should work setup + script', () => {
        const source = `<script setup lang="ts" generic="T extends string">
        const model = defineModel<{ foo: T }>();
        const test = defineProps<{ type: T}>();
        </script>
        <script lang="ts">
         const SUPA = 'hello'
        </script>
        <template>
          <span>1</span>
        </template>`;

        const p = process(source)

        expect(p.source).toBe(source)
        testSourceMaps(p.context.script)
    })

})