var GHPATH = "/OS-DPI";
var APP_PREFIX = "osdpi_";
var VERSION = "2023-11-13-18-45-1";
var URLS = [
  `${GHPATH}/`,
  `${GHPATH}/index.html`,
  `${GHPATH}/index.css`,
  `${GHPATH}/index.js`,
  `${GHPATH}/xlsx.js`,
];

var CACHE_NAME = APP_PREFIX + VERSION;
self.addEventListener("fetch", function (/** @type {FetchEvent} */ e) {
  // console.log("Fetch request : " + e.request.url);
  const url = new URL(e.request.url);
  if (URLS.includes(url.pathname)) {
    e.respondWith(
      caches.match(e.request).then(function (request) {
        if (request) {
          // console.log("Responding with cache : " + e.request.url);
          return request;
        } else {
          // console.log("File is not cached, fetching : " + e.request.url);
          return fetch(e.request);
        }
      })
    );
  }
});

self.addEventListener("install", function (/** @type {ExtendableEvent} */ e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      // console.log("Installing cache : " + CACHE_NAME);
      return cache.addAll(URLS);
    })
  );
});

self.addEventListener("activate", function (/** @type {ExtendableEvent} */ e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      var cacheWhitelist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX);
      });
      cacheWhitelist.push(CACHE_NAME);
      return Promise.all(
        keyList.map(function (key, i) {
          if (cacheWhitelist.indexOf(key) === -1) {
            // console.log("Deleting cache : " + keyList[i]);
            return caches.delete(keyList[i]);
          }
        })
      );
    })
  );
});

self.addEventListener("message", (/** @type {MessageEvent} */ event) => {
  if (event.data === "SKIP_WAITING") {
    // I'm missing something in my config to cause the following error
    // @ts-ignore
    self.skipWaiting();
  }
});
//# sourceMappingURL=service-worker.js.map
