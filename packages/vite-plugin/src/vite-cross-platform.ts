import path from "path";
import {
  Plugin,
  UserConfig,
  mergeConfig,
  BuildOptions,
  PluginOption,
} from "vite";
import dtsPlugin, { PluginOptions as DTSPluginOptions } from "vite-plugin-dts";

const viteModuleResolutions = ({
  platform,
  lib,
}: Pick<ViteCrossPlatformPluginOptions, "platform"> & {
  lib: Required<ViteCrossPlatformPluginOptions['lib']>;
}): Plugin => ({
  name: "@cross-platform-tools/vite-plugin",
  config: (userConfig) => {
    const { mode = "production" } = userConfig;

    return mergeConfig(
      {
        build: {
          lib: {
            entry: `${path.resolve(lib.entryDir, "./index.ts")}`,
            name: "index",
            formats: ["es"],
          },
          outDir: `${lib.outDir}/${platform}/${mode}`,
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
            ...lib.extensions.map((finalExtension) => `.${finalExtension}`),
            ...lib.extensions.map(
              (finalExtension) => `.${platform}.${finalExtension}`
            ),
          ],
        },
        test: {
          include: lib.extensions.map(
            (finalExtension) =>
              `./${lib.entryDir}/**/*.${platform}.test.${finalExtension}`
          ),
        },
      } as UserConfig,
      userConfig
    );
  },
});

type CrossPlatformPluginLibraryOptions = {
  /**
   * entry directory of your library
   *
   * @default src
   */
  entryDir: string;
  /**
   * Output directory of your library.
   *
   * @default dist
   */
  outDir: BuildOptions["outDir"];

  /**
   * Supported final extensions
   *
   * @default - ['ts', 'tsx', 'js', 'jsx']
   */
  extensions?: string[];
};

type ViteCrossPlatformPluginOptions = {
  platform: string;
  lib: CrossPlatformPluginLibraryOptions;
  outputTypes?: boolean;
  supportedPlatforms: string[];
  dtsPluginOptions?: DTSPluginOptions;
};

export const viteCrossPlatform = ({
  platform,
  supportedPlatforms,
  lib,
  outputTypes = true,
  dtsPluginOptions,
}: ViteCrossPlatformPluginOptions): PluginOption => {
  if (!platform || !supportedPlatforms.includes(platform)) {
    throw new Error(
      `Invalid platform. Supported values set to - ${supportedPlatforms.join(
        ", "
      )}. Change them in your vite.config.ts if required`
    );
  }

  const libOptions = {
    outDir: lib.outDir ?? "dist",
    entryDir: lib.entryDir ?? "src",
    extensions: lib.extensions ?? ["ts", "tsx", "js", "jsx"],
  };

  const plugins = [viteModuleResolutions({ platform, lib: libOptions })];

  if (outputTypes) {
    plugins.push(
      dtsPlugin({
        include: [libOptions.entryDir],
        exclude: [
          ...supportedPlatforms
            .filter((supportedPlatform) => supportedPlatform !== platform)
            .map(
              (excludePattern) => `${lib.entryDir}/**/*.${excludePattern}.*`
            ),
          `${lib.entryDir}/**/*.test.*`,
        ],
        copyDtsFiles: true,
        outDir: `${libOptions.outDir}/${platform}/types`,
        beforeWriteFile: async (filePath, content) => {
          return {
            filePath: filePath.replace(`.${platform}`, ""),
            content,
          };
        },
        ...dtsPluginOptions,
      })
    );
  }

  return plugins;
};
