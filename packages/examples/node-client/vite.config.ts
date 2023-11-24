/// <reference types="vitest" />

import { defineConfig } from "vite";
import { viteCrossPlatform } from '../../vite-plugin/vite-cross-platform';

// Want to add new extension and bundle? add it here :D
export const supportedPlatforms = ["web", "native"] as const;

type SupportedPlatformTypes = (typeof supportedPlatforms)[number];

const PLATFORM = process.env.PLATFORM as SupportedPlatformTypes;

export default defineConfig({
  plugins: [
    viteCrossPlatform({ platform: PLATFORM, supportedPlatforms }),
  ]
});
