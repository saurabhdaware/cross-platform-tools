<h1 align="center">✨ Cross Platform Tools ✨</h1>

<p align="center">Set of tools to help you build cross-platform libraries from a single codebase</p>

## `@cross-platform-tools/vite-plugin`

Vite plugin that abstracts out module resolutions so you can build for multiple platforms from a single codebase.


### 🤔 Umm... what is even this? what does it do exactly?

In it's simplest form, it takes module extensions and turns them into separate bundle.

| **Input** | **Output** |
|------------|-----------|
| <ul><li>src<ul><li>Button.potato.ts</li><li>Button.tomato.ts</li></ul></li></ul> | <ul><li>dist<ul><li>potato<ul><li>Button.js</li></ul></li><li>tomato<ul><li>Button.js</li></ul><li>types<ul><li>Button.d.ts</li></ul></li></li></ul> |

This allows you to keep your code for multiple platforms in single codebase.

Example, You can create a component library that supports React and Vue both using- 

- src
  - Button.react.tsx
  - Button.vue.tsx
  - buttonUtils.ts
  - buttonStyles.css

So your framework specific code stays in `Button.react.tsx` and `Button.vue.tsx` but both of them can import from same `buttonStyles.css` and have common logic inside `buttonUtils.ts`.

Checkout working examples below for better context.

### 🤝🏼 Getting Started 

- [**Open in Stackblitz**](https://stackblitz.com/~/github.com/saurabhdaware/server-edge-library)

  or scaffold locally -

- Scaffold an example server-edge-library

  ```sh
  npx degit saurabhdaware/server-edge-library server-edge
  ```
- Install Dependencies

  ```sh
  cd server-edge
  pnpm install
  ```

- Run the example of the library usage

  ```sh
  cd packages/server-edge-app
  node --conditions=server run.js # Runs the example with server bundle
  node --conditions=edge run.js # Runs the example with edge bundle
  ```

> [!note]
>
> The example is kept simple for better understanding of code. If your usecase requires you to build final bundles of app, you can also pass these conditions from [resolve.conditions](https://vitejs.dev/config/shared-options#resolve-conditions) method in vite.



### 🚀 Examples

|                               | GitHub                                                                                                    | StackBlitz                                                                                          | Local Scaffold                                                  |
|-------------------------------|-----------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------|-----------------------------------------------------------------|
| Server x Edge Library         | [saurabhdaware/server-edge-library](https://github.com/saurabhdaware/server-edge-library)                 | [Open in StackBlitz](https://stackblitz.com/~/github.com/saurabhdaware/server-edge-library)         | `npx degit saurabhdaware/server-edge-library server-edge`       |
| React x Vue Component Library | [saurabhdaware/react-vue-component-library](https://github.com/saurabhdaware/react-vue-component-library) | [Open in StackBlitz](https://stackblitz.com/~/github.com/saurabhdaware/react-vue-component-library) | `npx degit saurabhdaware/react-vue-component-library react-vue` |
| React x React Native Library  | [saurabhdaware/react-rn-library](https://github.com/saurabhdaware/react-rn-library)                       | [Open in StackBlitz](https://stackblitz.com/~/github.com/saurabhdaware/react-rn-library)            | `npx degit saurabhdaware/react-rn-library react-rn`             |
| Mobile x Desktop Site         | [saurabhdaware/desktop-mobile-site](https://github.com/saurabhdaware/desktop-mobile-site)                 | [Open in StackBlitz](https://stackblitz.com/~/github.com/saurabhdaware/desktop-mobile-site)         | `npx degit saurabhdaware/desktop-mobile-site desktop-mobile`    |



### ✨ Features

- #### Module Resolutions in Build
  
  `@cross-platform-tools/vite-plugin` package takes care of resolving extensions such as `.server.ts`, `.client.ts`, `.xyz.ts` and creates final bundles such as `dist/server/`, `dist/client/`, or `dist/xyz`.

- #### Module Resolutions in Tests

  It also takes care of resolving extensions for tests when used with `vitest`. So you can define your platform-specific tests with `.client.test.ts`, `.server.test.ts`, etc.

- #### Development and Production Builds

  You can create build using `--mode development` flag of Vite to generate development build. When used with `if (import.meta.env.MODE === 'development)` condition, it removes the development-specific code from production bundle.

- #### Base Library Setup

  This plugin also takes care of basic things required to build a library such as type file generations for all platforms, base library configuration setup with vite, etc.

### 📚 Manual Setup

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
      // E.g. something.server.ts and something.client.ts in this example
      supportedPlatforms: ['server', 'client'],
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
// src/getData.server.ts
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
  "scripts": "PLATFORM=server vite build && PLATFORM=client vite build",
  "exports": {
    "node": {
      "default": "./dist/server/production/index.js",
      "types": "./dist/server/types/index.d.ts"
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

Inspired from the setup of [Razorpay's Design System Setup - Blade](https://github.com/razorpay/blade). Checkout [The Sorcery of Building a Cross Platform Design System Architecture](https://youtu.be/ZT-FMdiHMfA?si=aXtHHt3StLw0UqOo) talk by [@kamleshchandnani](https://github.com/kamleshchandnani) where he explains the architecture of Razorpay's Design System in the context of React x React Native 🤗


Like my work? You can star this repo or you can sponsor me from [GitHub Sponsors @saurabhdaware](https://github.com/sponsors/saurabhdaware) ⭐️
