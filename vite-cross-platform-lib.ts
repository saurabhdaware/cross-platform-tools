import path from "path";
import { Plugin, mergeConfig } from "vite";
import dtsPlugin, { PluginOptions as DTSPluginOptions } from "vite-plugin-dts";

const viteModuleResolutions = ({ platform }): Plugin => ({
  name: "vite-cross-platform-library",
  config: (userConfig) => {
    const { mode = "production" } = userConfig;
    return mergeConfig(
      {
        build: {
          lib: {
            entry: "./src/index.ts",
            name: "index",
            formats: ["es"],
          },
          outDir: `dist/${platform}/${mode}`,
          target: "es2016",
          emptyOutDir: true,
          rollupOptions: {
            output: {
              preserveModules: true,
              inlineDynamicImports: false,
              entryFileNames: ({ name }) => {
                return `${name.replace(`.${platform}`, "")}.js`;
              },
            },
          },
        },
        resolve: {
          extensions: [
            ".js",
            ".ts",
            ".jsx",
            ".tsx",
            `.${platform}.ts`,
            `.${platform}.tsx`,
          ],
          alias: {
            "@": `${path.resolve(__dirname, "./src")}`,
          },
        },
        test: {
          include: [`./src/**/*.${platform}.test.ts`],
        },
      },
      userConfig
    );
  },
});

export const viteCrossPlatformLibrary = ({
  platform,
  supportedPlatforms,
  dtsPluginOptions,
}: {
  platform: string;
  supportedPlatforms: string[] | readonly string[];
  dtsPluginOptions?: DTSPluginOptions;
}) => {
  if (!platform || !supportedPlatforms.includes(platform)) {
    throw new Error(
      `Invalid platform. Supported values - ${supportedPlatforms.join(", ")}`
    );
  }

  return [
    viteModuleResolutions({ platform }),
    dtsPlugin({
      include: ["src"],
      exclude: [
        ...supportedPlatforms
          .filter((supportedPlatform) => supportedPlatform !== platform)
          .map((excludePattern) => `src/**/*.${excludePattern}.ts?(x)`),
        "src/**/*.test.ts?(x)",
      ],
      copyDtsFiles: true,
      outDir: `dist/${platform}/types`,
      beforeWriteFile: async (filePath, content) => {
        return {
          filePath: filePath.replace(`.${platform}`, ""),
          content,
        };
      },
    }),
  ];
};
