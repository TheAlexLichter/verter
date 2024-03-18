// vite.config.ts
import { defineConfig } from "file:///D:/dev/personal/vue-typescript/node_modules/.pnpm/vite@5.0.11/node_modules/vite/dist/node/index.js";
import dts from "file:///D:/dev/personal/vue-typescript/node_modules/.pnpm/vite-plugin-dts@3.7.3_typescript@5.3.3_vite@5.0.11/node_modules/vite-plugin-dts/dist/index.mjs";
var vite_config_default = defineConfig({
  build: {
    lib: {
      entry: "./src/index.ts",
      fileName: "index",
      formats: ["es", "cjs"]
    },
    sourcemap: true,
    rollupOptions: {
      external: [
        "typescript",
        "source-map-js",
        "glob",
        "@vue/shared",
        "@vue/compiler-core",
        "@vue/compiler-sfc",
        "@types/ts-expose-internals",
        "@babel/parser",
        "@babel/types"
      ]
    }
  },
  plugins: [
    dts({
      // rollupTypes: true
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxkZXZcXFxccGVyc29uYWxcXFxcdnVlLXR5cGVzY3JpcHRcXFxccGFja2FnZXNcXFxcY29yZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcZGV2XFxcXHBlcnNvbmFsXFxcXHZ1ZS10eXBlc2NyaXB0XFxcXHBhY2thZ2VzXFxcXGNvcmVcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L2Rldi9wZXJzb25hbC92dWUtdHlwZXNjcmlwdC9wYWNrYWdlcy9jb3JlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IGR0cyBmcm9tICd2aXRlLXBsdWdpbi1kdHMnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIGJ1aWxkOiB7XHJcbiAgICBsaWI6IHtcclxuICAgICAgZW50cnk6IFwiLi9zcmMvaW5kZXgudHNcIixcclxuICAgICAgZmlsZU5hbWU6IFwiaW5kZXhcIixcclxuICAgICAgZm9ybWF0czogW1wiZXNcIiwgXCJjanNcIl0sXHJcbiAgICB9LFxyXG4gICAgc291cmNlbWFwOiB0cnVlLFxyXG4gICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICBleHRlcm5hbDogW1xyXG4gICAgICAgIFwidHlwZXNjcmlwdFwiLFxyXG4gICAgICAgIFwic291cmNlLW1hcC1qc1wiLFxyXG4gICAgICAgIFwiZ2xvYlwiLFxyXG4gICAgICAgIFwiQHZ1ZS9zaGFyZWRcIixcclxuICAgICAgICBcIkB2dWUvY29tcGlsZXItY29yZVwiLFxyXG4gICAgICAgIFwiQHZ1ZS9jb21waWxlci1zZmNcIixcclxuICAgICAgICBcIkB0eXBlcy90cy1leHBvc2UtaW50ZXJuYWxzXCIsXHJcbiAgICAgICAgXCJAYmFiZWwvcGFyc2VyXCIsXHJcbiAgICAgICAgXCJAYmFiZWwvdHlwZXNcIixcclxuICAgICAgXSxcclxuICAgIH0sXHJcbiAgfSxcclxuICBwbHVnaW5zOiBbXHJcbiAgICBkdHMoe1xyXG4gICAgICAvLyByb2xsdXBUeXBlczogdHJ1ZVxyXG4gICAgfSlcclxuICBdXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWtVLFNBQVMsb0JBQW9CO0FBQy9WLE9BQU8sU0FBUztBQUVoQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixPQUFPO0FBQUEsSUFDTCxLQUFLO0FBQUEsTUFDSCxPQUFPO0FBQUEsTUFDUCxVQUFVO0FBQUEsTUFDVixTQUFTLENBQUMsTUFBTSxLQUFLO0FBQUEsSUFDdkI7QUFBQSxJQUNBLFdBQVc7QUFBQSxJQUNYLGVBQWU7QUFBQSxNQUNiLFVBQVU7QUFBQSxRQUNSO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQTtBQUFBLElBRUosQ0FBQztBQUFBLEVBQ0g7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
