let deferredPrompt;

self.addEventListener('install', event => {
  console.log('installing…');
  event.waitUntil(
    caches.open('static').then(function(cache) {
        console.log('[Service Worker] Precaching App Shell');
        cache.add('/');
        cache.add('/dcs/');
        cache.add('/dcs/css/dashboard-v2.css');
        cache.add('/dcs/js/application.js');
        cache.add('/dcs/js/irb.js');
        cache.add('/dcs/js/chart_config.js');
    })
  );
});

// activate
self.addEventListener('activate', event => {
  console.log('now ready to handle fetches!');
  return self.clients.claim();
});

// fetch
self.addEventListener('fetch', event => {
  console.log('now fetch!');
});
