const CACHE_NAME = 'goldx-cache-v2';

// تم تعديل المسارات إلى نسبية وإضافة ملفات الهوية لضمان عمل الـ PWA بنجاح
const ASSETS_TO_CACHE = [
  'dashboard.html',
  'tasks.html',
  'profile.html',
  'logs.html',
  'support.html',
  'app.js',
  'manifest.json',
  'icon-192x192.png',
  'icon-512x512.png',
  'https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
