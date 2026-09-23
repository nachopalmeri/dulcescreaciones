/**
 * Service Worker for Dulces Creaciones
 * Implements a cache-first strategy for optimal performance
 * CACHE_NAME: dulces-creaciones-v2
 */

// Cache configuration
const CACHE_NAME = 'dulces-creaciones-v2';

/**
 * Critical files to cache during installation
 * These are the core assets needed for the app to function offline
 */
const urlsToCache = [
  '/',
  '/styles.css',
  '/scripts.js',
  '/manifest.json',
  '/logo_perfil.jpg',
  '/logo_perfil-removebg-preview.png',
  '/images/torta-minimalista-romantica-hero.webp'
];

/**
 * INSTALL EVENT
 * Triggered when the service worker is first installed
 * Caches all critical assets for offline use
 */
self.addEventListener('install', (event) => {

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        // Add all URLs to cache - some may fail (e.g., external resources)
        // but we don't want that to stop the installation
        return cache.addAll(urlsToCache)
          .then(() => {
          })
          .catch((error) => {
            console.warn('[Service Worker] Some assets failed to cache:', error);
            // Continue even if some assets fail to cache
            // This prevents the service worker from failing to install
          });
      })
      .then(() => {
        // Skip waiting to activate the new service worker immediately
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[Service Worker] Install failed:', error);
      })
  );
});

/**
 * FETCH EVENT
 * Implements cache-first strategy:
 * 1. Try to serve from cache first (fastest)
 * 2. If not in cache, fetch from network
 * 3. Cache new network responses for future requests
 * 4. If network fails and not in cache, serve offline fallback
 */
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests and browser extensions
  if (event.request.method !== 'GET') return;
  if (event.request.url.startsWith('chrome-extension://')) return;

  // Pages: network-first so visitors always get the latest version
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match('/')))
    );
    return;
  }

  event.respondWith(
    // STEP 1: Try to find response in cache
    caches.match(event.request)
      .then((cachedResponse) => {
        // If found in cache, return cached version immediately
        if (cachedResponse) {

          // Optional: Refresh cache in background (stale-while-revalidate pattern)
          // Fetch from network to update cache for next time
          fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                const cacheCopy = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(event.request, cacheCopy);
                });
              }
            })
            .catch(() => {
              // Network fetch failed, but we already served from cache
            });

          return cachedResponse;
        }

        // STEP 2: Not in cache - fetch from network

        return fetch(event.request)
          .then((networkResponse) => {
            // Check if we received a valid response
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              // For non-basic responses (like CORS), just return them without caching
              return networkResponse;
            }

            // STEP 3: Clone and cache the network response
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              })
              .catch((error) => {
                console.warn('[Service Worker] Failed to cache resource:', error);
              });

            return networkResponse;
          })
          .catch((error) => {
            // STEP 4: Network failed and not in cache
            console.error('[Service Worker] Fetch failed:', error);

            // For HTML requests, could return offline fallback page
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/');
            }

            // Otherwise, let the error propagate
            throw error;
          });
      })
  );
});

/**
 * ACTIVATE EVENT
 * Triggered when the service worker takes control
 * Cleans up old caches from previous versions
 */
self.addEventListener('activate', (event) => {

  event.waitUntil(
    // Get all cache names
    caches.keys()
      .then((cacheNames) => {
        // Filter for caches that belong to this app but are not the current version
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              // Keep only the current cache version
              return cacheName.startsWith('dulces-creaciones-') && cacheName !== CACHE_NAME;
            })
            .map((oldCacheName) => {
              // Delete old caches
              return caches.delete(oldCacheName);
            })
        );
      })
      .then(() => {
        // Claim all clients so the service worker controls them immediately
        return self.clients.claim();
      })
      .then(() => {
      })
      .catch((error) => {
        console.error('[Service Worker] Activation failed:', error);
      })
  );
});

/**
 * MESSAGE EVENT
 * Handles messages from the main thread
 * Used for skipWaiting command from the page
 */
self.addEventListener('message', (event) => {

  if (event.data && event.data.type) {
    switch (event.data.type) {
      case 'SKIP_WAITING':
        // Skip waiting and activate immediately
        self.skipWaiting();
        break;

      case 'CHECK_VERSION':
        // Respond with current cache version
        event.ports[0].postMessage({
          type: 'VERSION_RESPONSE',
          version: CACHE_NAME
        });
        break;

      case 'CLEAR_CACHE':
        // Clear all caches
        caches.keys().then((cacheNames) => {
          return Promise.all(
            cacheNames.map((cacheName) => caches.delete(cacheName))
          );
        }).then(() => {
          if (event.ports && event.ports[0]) {
            event.ports[0].postMessage({
              type: 'CACHE_CLEARED',
              success: true
            });
          }
        });
        break;

      default:
    }
  }
});

/**
 * SYNC EVENT (Background Sync)
 * Handles deferred actions when connection is restored
 * Useful for form submissions that failed due to offline state
 */
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-forms') {
    // Handle deferred form submissions here
    // event.waitUntil(syncForms());
  }
});

/**
 * PUSH EVENT
 * Handles push notifications
 */
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();

    const options = {
      body: data.body || 'Nueva notificación de Dulces Creaciones',
      icon: '/logo_perfil.jpg',
      badge: '/logo_perfil.jpg',
      vibrate: [100, 50, 100],
      data: data.data || {},
      actions: data.actions || []
    };

    event.waitUntil(
      self.registration.showNotification(
        data.title || 'Dulces Creaciones',
        options
      )
    );
  }
});

/**
 * NOTIFICATION CLICK EVENT
 * Handles clicks on push notifications
 */
self.addEventListener('notificationclick', (event) => {

  event.notification.close();

  // Open the relevant page
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});
