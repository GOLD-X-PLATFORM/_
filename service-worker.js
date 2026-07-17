const CACHE_NAME = 'goldx-cache-v1';
// قائمة الملفات والمكتبات الخارجية التي سيتم حفظها لضمان سرعة التطبيق الفائقة
const ASSETS_TO_CACHE = [
  '/dashboard.html',
  '/tasks.html',
  '/profile.html',
  '/logs.html',
  '/support.html',
  '/app.js',
  'https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'
];

// تفعيل وتثبيت السيرفس وركر وحفظ الملفات الأساسية
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// إدارة الطلبات وتقديم الملفات المخزنة لتسريع التصفح عند ضعف الإنترنت
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
