// service-worker.js

const CACHE_NAME = 'my-cache-v1'; // Уникальное имя кеша
const urlsToCache = [
    '/', // Главная страница
    '/index.html', // HTML файл
    '/style.css', // CSS файл
    '/app.js', // Ваш JS файл
    '/assets/boo.png', // Картинка (если она у вас)
    // Добавьте другие статические файлы, которые хотите кешировать
];

// Устанавливаем кеш при установке service worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Service Worker: Caching files');
            return cache.addAll(urlsToCache); // Кешируем все указанные файлы
        })
    );
});

// Обновление кеша
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME]; // Массив с текущими кешами
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        console.log('Service Worker: Deleting old cache', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Слушаем запросы и обрабатываем их с кешированием
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Если файл уже в кеше, отдаем его
            if (cachedResponse) {
                console.log('Service Worker: Returning cached response');
                return cachedResponse;
            }

            // Если файл не в кеше, отправляем запрос на сервер
            return fetch(event.request).then((response) => {
                // Добавляем новый файл в кеш
                return caches.open(CACHE_NAME).then((cache) => {
                    console.log('Service Worker: Caching new resource');
                    cache.put(event.request, response.clone()); // Кешируем новый файл
                    return response; // Возвращаем ответ
                });
            });
        })
    );
});
