/**
 * Service Worker for Dulces Creaciones
 * Implements a cache-first strategy for optimal performance
 * CACHE_NAME: dulces-creaciones-v1
 */

// Cache configuration
const CACHE_NAME = 'dulces-creaciones-v1';

/**
 * Critical files to cache during installation
 * These are the core assets needed for the app to function offline
 */
const urlsToCache = [
  // Core application files
  '/',
  '/index.html',
  '/styles.css',
  '/scripts.js',
  '/manifest.json',
  '/logo_perfil.jpg',

  // HTML pages
  '/tortas-15-anos.html',
  '/mesas-dulces.html',
  '/tortas-gaming.html',
  '/tortas-futbol.html',
  '/tortas-infantiles.html',

  // Logo and branding images
  '/logo_transparent.png',
  '/logo_perfil-removebg-preview.png',

  // Gallery images (root level)
  '/gallery_img_1.jpg',
  '/gallery_img_2.jpg',
  '/gallery_img_3.jpg',
  '/gallery_img_4.jpg',
  '/gallery_img_5.jpg',
  '/gallery_img_6.jpg',
  '/gallery_img_7.jpg',
  '/gallery_img_8.jpg',
  '/gallery_img_9.jpg',
  '/gallery_img_10.jpg',
  '/gallery_img_11.jpg',
  '/gallery_img_12.jpg',
  '/gallery_img_13.jpg',
  '/gallery_img_14.jpg',

  // Product images (root level)
  '/torta_sanlorrenzo_camiseta.jpg',
  '/torta_moana_amanda.jpg',
  '/torta_kuromi_morada.jpg',
  '/torta_happy15_rosa.jpg',
  '/torta_globos_verde.jpg',
  '/torta_fortnite.jpg',
  '/torta_disco_cumple.jpg',
  '/torta_corazones.jpg',

  // Images folder - Gallery webp images
  '/images/gallery-1.webp',
  '/images/gallery-2.webp',
  '/images/gallery-3.webp',
  '/images/gallery-4.webp',
  '/images/gallery-5.webp',
  '/images/gallery-6.webp',
  '/images/gallery-7.webp',
  '/images/gallery-8.webp',
  '/images/gallery-9.webp',
  '/images/gallery-10.webp',
  '/images/gallery-11.webp',
  '/images/gallery-12.webp',
  '/images/gallery-13.webp',
  '/images/gallery-14.webp',

  // Images folder - Product webp images
  '/images/torta-corazones-amor.webp',
  '/images/torta-disco-retro.webp',
  '/images/torta-fortnite-gaming.webp',
  '/images/torta-globos-cumpleanos.webp',
  '/images/torta-15-anos-fiesta.webp',
  '/images/torta-kuromi-sanrio.webp',
  '/images/torta-moana-disney.webp',
  '/images/torta-futbol-san-lorenzo.webp',
  '/images/torta-futbol-camiseta.webp',
  '/images/torta-infantil-personalizada.webp',
  '/images/torta-anime-tematica.webp',
  '/images/torta-quinceanos-rosa.webp',
  '/images/torta-gaming-topper.webp',
  '/images/torta-dos-pisos.webp',
  '/images/torta-elegante-festiva.webp',
  '/images/torta-minimalista-romantica.webp'
];

/**
 * INSTALL EVENT
 * Triggered when the service worker is first installed
 * Caches all critical assets for offline use
 */
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install event started');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Cache opened, adding critical assets');
        // Add all URLs to cache - some may fail (e.g., external resources)
        // but we don't want that to stop the installation
        return cache.addAll(urlsToCache)
          .then(() => {
            console.log('[Service Worker] All assets cached successfully');
          })
          .catch((error) => {
            console.warn('[Service Worker] Some assets failed to cache:', error);
            // Continue even if some assets fail to cache
            // This prevents the service worker from failing to install
          });
      })
      .then(() => {
        // Skip waiting to activate the new service worker immediately
        console.log('[Service Worker] Skipping waiting, activating immediately');
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

  event.respondWith(
    // STEP 1: Try to find response in cache
    caches.match(event.request)
      .then((cachedResponse) => {
        // If found in cache, return cached version immediately
        if (cachedResponse) {
          console.log('[Service Worker] Serving from cache:', event.request.url);

          // Optional: Refresh cache in background (stale-while-revalidate pattern)
          // Fetch from network to update cache for next time
          fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                const cacheCopy = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(event.request, cacheCopy);
                  console.log('[Service Worker] Cache refreshed for:', event.request.url);
                });
              }
            })
            .catch(() => {
              // Network fetch failed, but we already served from cache
              console.log('[Service Worker] Background refresh failed, serving cached version');
            });

          return cachedResponse;
        }

        // STEP 2: Not in cache - fetch from network
        console.log('[Service Worker] Not in cache, fetching:', event.request.url);

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
                console.log('[Service Worker] Cached new resource:', event.request.url);
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
              return caches.match('/index.html');
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
  console.log('[Service Worker] Activate event started');

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
              console.log('[Service Worker] Deleting old cache:', oldCacheName);
              return caches.delete(oldCacheName);
            })
        );
      })
      .then(() => {
        console.log('[Service Worker] Old caches cleaned up');
        // Claim all clients so the service worker controls them immediately
        return self.clients.claim();
      })
      .then(() => {
        console.log('[Service Worker] Clients claimed, activation complete');
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
  console.log('[Service Worker] Message received:', event.data);

  if (event.data && event.data.type) {
    switch (event.data.type) {
      case 'SKIP_WAITING':
        // Skip waiting and activate immediately
        console.log('[Service Worker] Skip waiting command received');
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
          console.log('[Service Worker] All caches cleared');
          if (event.ports && event.ports[0]) {
            event.ports[0].postMessage({
              type: 'CACHE_CLEARED',
              success: true
            });
          }
        });
        break;

      default:
        console.log('[Service Worker] Unknown message type:', event.data.type);
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
    console.log('[Service Worker] Background sync triggered');
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
    console.log('[Service Worker] Push received:', data);

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
  console.log('[Service Worker] Notification clicked:', event.notification);

  event.notification.close();

  // Open the relevant page
  event.waitUntil(
    clients.openWindow(event.notification.dataA.url || '/')
  );
});

console.log('[Service Worker] Service worker script loaded');
