/// <reference types="vitest" />

import { defineConfig } from "vite";
import { viteCrossPlatform } from "@cross-platform-tools/vite-plugin";
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    viteCrossPlatform({
      platform: process.env.PLATFORM!,
      supportedPlatforms: ["web", "native"],
      entryDir: 'src',
      outDir: 'dist',
      outputTypes: false,
      isLibrary: false,
    }),
  ]
});
