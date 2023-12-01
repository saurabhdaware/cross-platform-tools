<h1 align="center">✨ Cross Platform Tools ✨</h1>

<p align="center">Set of tools to help you build cross-platform libraries from a single codebase</p>

## `@cross-platform-tools/vite-plugin`

Vite plugin that abstracts out module resolutions so you can build for multiple platforms from a single codebase.

### Getting Started

- Scaffold an example node-edge-library

  ```sh
  npx degit saurabhdaware/node-edge-library node-edge-library
  ```
- Install Dependencies

  ```sh
  pnpm install
  ```

- Run the example of the library usage

  ```sh
  cd packages/node-edge-app
  node run.js # Runs the example with node bundle
  node --conditions=edge run.js # Runs the example with edge bundle
  ```

> [!note]
>
> The example is kept simple for better understanding of code. If your usecase requires you to build final bundles of app, you can also pass these conditions from [resolve.conditions](https://vitejs.dev/config/shared-options#resolve-conditions) method in vite.

### How does it work?

##### Module Resolutions in Build

`@cross-platform-tools/vite-plugin` package takes care of resolving extensions such as `.node.ts`, `.client.ts`, `.xyz.ts` and creates final bundles such as `dist/node/`, `dist/client/`, or `dist/xyz`.

##### Module Resolutions in Tests

It also takes care of resolving extensions for tests when used with `vitest`. So you can define your platform-specific tests with `.client.test.ts`, `.node.test.ts`, etc.

##### Base Library Setup

This plugin also takes care of basic things required to build a library such as type file generations for all platforms, base library configuration setup with vite, etc.

### Manual Setup

This section explains the steps required to set up a library from scratch. Check out the [Getting Started](#getting-started) for Quick Start guide.

#### Step 1: Install the Vite Plugin

```sh
npm i --save-dev @cross-platform-tools/vite-plugin
```


#### Step 2: Add Vite Plugin to your configuration

```ts
// vite.config.ts
import { defineConfig } from "vite";
import { viteCrossPlatform } from '@cross-platform-tools/vite-plugin';

export default defineConfig({
  plugins: [
    viteCrossPlatform({ 
      // We call `vite build` multiple times for each platform
      platform: process.env.PLATFORM,
      // This can be any string that is used in filenames. 
      // E.g. something.node.ts and something.client.ts in this example
      supportedPlatforms: ['node', 'client'],
      lib: {
        entryDir: 'src',
        outDir: 'dist'
      } 
    }),
  ]
});
```

#### Step 2: Create files with extensions used in `supportedPlatforms` above


```ts
// src/getData.node.ts
export const getData = () => 1234;
```


```ts
// src/getData.client.ts
export const getData = () => 4321;
```


```ts
// src/index.ts
export { getData } from './getData';
```

#### Step 3: Add build scripts and exports to your package.json

```json
{
  "scripts": "PLATFORM=node vite build && PLATFORM=client vite build",
  "exports": {
    "node": {
      "default": "./dist/node/production/index.js",
      "types": "./dist/node/types/index.d.ts"
    },
    "default": {
      "default": "./dist/client/production/index.js",
      "types": "./dist/client/types/index.d.ts"
    }
  }
}
```

You can follow the [package.json exports documentation](https://nodejs.org/api/packages.html#conditional-exports) of node.js and export as per your use case.

Bundlers and tools have their own defined namespaces in exports from which they pick bundles. Such as [React Native has `react-native` namespace](https://reactnative.dev/blog/2023/06/21/package-exports-support#the-new-react-native-condition), while most bundlers use the `browser` namespace for client bundling.

You can also define your custom namespace such as `"xyz": "./path/to/bundle"` and use it with `node --condition=xyz ./file.js` on consumer end or define it in your bundler (e.g. using [`resolve.conditions`](https://vitejs.dev/config/shared-options#resolve-conditions))


---


Thanks for checking this out! Do drop your feedback on [Twitter (@saurabhdawaree)](https://x.com/saurabhdawaree). 

Like my work? You can sponsor me from [GitHub Sponsors @saurabhdaware](https://github.com/sponsors/saurabhdaware)