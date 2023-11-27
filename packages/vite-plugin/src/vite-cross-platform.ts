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
  entryDir,
  outDir,
  extensions,
  isLibrary
}: Pick<ViteCrossPlatformPluginOptions, "platform" | "entryDir" | "outDir" | 'isLibrary'> & {
  extensions: string[];
}): Plugin => ({
  name: "@cross-platform-tools/vite-plugin",
  config: (userConfig) => {
    const { mode = "production" } = userConfig;

    return mergeConfig(
      {
        build: isLibrary ? {
          lib: {
            entry: `${path.resolve(entryDir, "./index.ts")}`,
            name: "index",
            formats: ["es"],
          },
          outDir: `${outDir}/${platform}/${mode}`,
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
        } : undefined,
        resolve: {
          extensions: [
            ...extensions.map((finalExtension) => `.${finalExtension}`),
            ...extensions.map(
              (finalExtension) => `.${platform}.${finalExtension}`
            ),
          ],
        },
        test: {
          include: extensions.map(
            (finalExtension) =>
              `./${entryDir}/**/*.${platform}.test.${finalExtension}`
          ),
        },
      } as UserConfig,
      userConfig
    );
  },
});

type ViteCrossPlatformPluginOptions = {
  platform: string;
  outputTypes?: boolean;
  supportedPlatforms: string[];
  dtsPluginOptions?: DTSPluginOptions;
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

  /**
   * Is building for a library
   * 
   * @default true
   */
  isLibrary?: boolean;
};

export const viteCrossPlatform = ({
  platform,
  supportedPlatforms,
  entryDir = "src",
  outDir = "dist",
  extensions = ["ts", "tsx", "js", "jsx"],
  outputTypes = true,
  isLibrary = true,
  dtsPluginOptions,
}: ViteCrossPlatformPluginOptions): PluginOption => {
  if (!platform || !supportedPlatforms.includes(platform)) {
    throw new Error(
      `Invalid platform. Supported values set to - ${supportedPlatforms.join(
        ", "
      )}. Change them in your vite.config.ts if required`
    );
  }

  const plugins = [
    viteModuleResolutions({ platform, entryDir, outDir, extensions, isLibrary }),
  ];

  if (outputTypes && isLibrary) {
    plugins.push(
      dtsPlugin({
        include: [entryDir],
        exclude: [
          ...supportedPlatforms
            .filter((supportedPlatform) => supportedPlatform !== platform)
            .map((excludePattern) => `${entryDir}/**/*.${excludePattern}.*`),
          `${entryDir}/**/*.test.*`,
        ],
        copyDtsFiles: true,
        outDir: `${outDir}/types`,
        ...dtsPluginOptions,
      })
    );
  }

  return plugins;
};
