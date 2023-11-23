/// <reference types="vitest" />

import { defineConfig } from "vite";
import { viteCrossPlatformLibrary } from "./vite-cross-platform-lib";

// Want to add new extension and bundle? add it here :D
export const supportedPlatforms = ["web", "native"] as const;

type SupportedPlatformTypes = (typeof supportedPlatforms)[number];

const PLATFORM = process.env.PLATFORM as SupportedPlatformTypes | undefined;

export default defineConfig({
  plugins: [
    viteCrossPlatformLibrary({ platform: PLATFORM, supportedPlatforms }),
  ],
});
