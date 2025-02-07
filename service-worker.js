const CACHE_NAME = 'my-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/main.css',
    '/main.js',
    '29b97a89167d3bb20e1b.png',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching files');
                return cache.addAll(urlsToCache);
            })
            .catch((error) => console.error('Service Worker: Install failed', error))
    );
    self.skipWaiting();
});


self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Deleting old cache', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            return self.clients.claim();
        })
    );
});


const fetchWithTimeout = (request, timeout = 5000) => {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('Timeout')), timeout);
        fetch(request).then(response => {
            clearTimeout(timer);
            resolve(response);
        }).catch(err => {
            clearTimeout(timer);
            reject(err);
        });
    });
};


self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    if (url.protocol === 'chrome-extension:' || event.request.url.includes('hot-update')) {
        return;
    }

    if (event.request.url.startsWith('http://localhost:3000')) {
        event.respondWith(fetchWithTimeout(event.request));
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                console.log('Service Worker: Returning cached response');
                return cachedResponse;
            }

            return fetchWithTimeout(event.request)
                .then((response) => {
                    if (!response || !response.ok) {
                        return response;
                    }

                    return caches.open(CACHE_NAME).then((cache) => {
                        console.log('Service Worker: Caching new resource', event.request.url);
                        cache.put(event.request, response.clone());
                        return response;
                    });
                })
                .catch(() => {
                    console.warn('Service Worker: Network request failed, returning fallback');
                    return caches.match('/index.html');
                });
        })
    );
});
