const CACHE='amasan-v10';
self.addEventListener('install', e=>{
e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['/','/index.html','/track.html','/manifest.json'])));
});
self.addEventListener('fetch', e=>{
e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});