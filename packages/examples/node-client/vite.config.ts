/// <reference types="vitest" />

import { defineConfig } from "vite";
import { viteCrossPlatform } from '@cross-platform-tools/vite-plugin';

// Want to add new extension and bundle? add it here :D
export const supportedPlatforms = ["client", "node"] as const;

type SupportedPlatformTypes = (typeof supportedPlatforms)[number];

const PLATFORM = process.env.PLATFORM as SupportedPlatformTypes;

export default defineConfig({
  plugins: [
    viteCrossPlatform({ platform: PLATFORM, supportedPlatforms }),
  ]
});
