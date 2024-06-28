# vite-sw
vite-sw is a plugin for writing Service Worker on Vite.

### Setting up
To install:
```shell
npm i -D vite-sw
yarn add -D vite-sw
pnpm add -D vite-sw
bun add -D vite-sw
```

Add plugin to `vite.config.ts`:
```ts
import { defineConfig } from 'vite'
import { pluginSW } from './lib'

export default defineConfig({
  plugins: [pluginSW()],
})
```

Add types to `vite-env.d.ts`:
```ts
// ...

/// <reference path="vite-sw/types" />

// ...
```

## Usage

```ts
// src/sw.ts
/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope

self.addEventListener('fetch', () => {
  // Write code here
})
self.addEventListener('install', () => {
  self.skipWaiting()
})
```

And import it:
```ts
import regester from './sw?sw'

const regestered: ServiceWorkerRegistration = await regester({
  scope: '/'
})
```
