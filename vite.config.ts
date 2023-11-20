import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// Want to add new extension and bundle? add it here :D
export const supportedPlatforms = ["web", "native"] as const;

type SupportedPlatformTypes = (typeof supportedPlatforms)[number];

const PLATFORM = process.env.PLATFORM as SupportedPlatformTypes | undefined;

if (!PLATFORM || !supportedPlatforms.includes(PLATFORM)) {
  throw new Error(
    `Invalid PLATFORM env variable. Supported values - ${supportedPlatforms.join(
      ", "
    )}`
  );
}

export default defineConfig({
  plugins: [
    dts({
      include: ["src"],
      exclude: supportedPlatforms.filter((platform) => platform !== PLATFORM).map((excludePattern) => `src/**/*.${excludePattern}.ts`),
      copyDtsFiles: true,
      outDir: `dist/${PLATFORM}/types`,
      beforeWriteFile: async (filePath, content) => {
        return {
          filePath: filePath.replace(`.${PLATFORM}`, ""),
          content
        }
      }
    }),
  ],
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", `.${PLATFORM}.ts`, `.${PLATFORM}.tsx`],
  },
  build: {
    lib: {
      entry: "./src/index.ts",
      name: "my-lib",
      formats: ["es"],
    },
    outDir: `dist/${PLATFORM}`,
    target: "es2016",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        preserveModules: true,
        inlineDynamicImports: false,
        entryFileNames: ({ name }) => {
          return `${name.replace(`.${PLATFORM}`, "")}.js`;
        },
      },
    },
  },
});
