import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const shouldBuildTypes = process.env.TYPES !== 'false';

export default defineConfig({
  plugins: [
    shouldBuildTypes ? dts({
      include: ["src"],
      outDir: 'dist',
      copyDtsFiles: true
    }) : undefined,
  ],
  build: {
    emptyOutDir: false,
    lib: {
      entry: "./src/index.ts",
      name: "index",
      formats: ["es"],
    },
    outDir: "dist",
    rollupOptions: {
      external: ['vite-plugin-dts', 'vite', 'path'],
      output: {
        entryFileNames: '[name].js',
        preserveModules: true,
        inlineDynamicImports: false,
      }
    }
  },
});
