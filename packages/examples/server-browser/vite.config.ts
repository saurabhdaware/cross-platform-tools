/// <reference types="vitest" />

import { defineConfig } from "vite";
import { viteCrossPlatform } from "@cross-platform-tools/vite-plugin";

export default defineConfig({
  plugins: [
    viteCrossPlatform({
      platform: process.env.PLATFORM!,
      supportedPlatforms: ["browser", "server"],
      entryDir: 'src',
      outDir: 'dist',
      outputTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: './src/index.ts'
    }
  }
});
