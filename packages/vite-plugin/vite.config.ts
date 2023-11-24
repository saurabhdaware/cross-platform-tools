import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dts({
      include: ["src"],
      outDir: 'dist',
      copyDtsFiles: true
    }),
  ],
  build: {
    lib: {
      entry: "./src/index.ts",
      name: "index",
      formats: ["es"],
    },
    outDir: "dist",
    rollupOptions: {
      external: ['vite-plugin-dts', 'vite'],
      output: {
        entryFileNames: '[name].js',
        preserveModules: true,
        inlineDynamicImports: false,
      }
    }
  },
});
