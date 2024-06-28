/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope

self.addEventListener('fetch', () => {})
self.addEventListener('install', () => {
  self.skipWaiting()
})
