# cross-platform-tools

> **Warning**
>
> This is WIP repo. Not really usable right now.

A set of tools to help you build cross-platform libraries 🚀

## `@cross-platform-tools/vite-plugin`

Vite plugin that abstracts out module resolutions so you can build for multiple platforms from a single codebase.

### How to Setup?

#### Step 1: Add Vite Plugin to your configuration

```ts
// vite.config.ts
import { defineConfig } from "vite";
import { viteCrossPlatform } from '@cross-platform-tools/vite-plugin';

export default defineConfig({
  plugins: [
    viteCrossPlatform({ 
      platform: process.env.PLATFORM, 
      supportedPlatforms: ['node', 'client'],
      lib: {
        entryDir: 'src',
        outDir: 'dist'
      } 
    }),
  ]
});
```

#### Step 2: Create files like


```ts
// getData.node.ts
export const getData = () => 1234;
```


```ts
// getData.client.ts
export const getData = () => 4321;
```


```ts
// index.ts
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