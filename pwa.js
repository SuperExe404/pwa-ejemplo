// Plantilla de un service worker minimo
const { cache } = require("react");

//1. Nombre del sw y los archivos a cachear
const CACHE_NAME = "mi-cache";
const urlsToCache = [
    "index.html",
    "style.css",
    "app.js",
    "offline.html"
];

//2. INSTALL -> se ejecuta al installar el service worker
//se cachean ( se meten a cache) los recursos base de la PWA
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open((CACHE_NAME).then(cache => cache.addAll(urlsToCache)))
    );
});

// 3. ACTIVATE -> se ejecuta al activarse el sw
// limpiar el cache viejo, para mantener sólo la versión actual de la caché
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys => 
            Promise.all(
                keys.filter( key => key !== CACHE_NAME)
                .map(key => caches.delete(key))
            )
        )
    );
});

// 4. FETCH -> intercepta peticiones de la app
// Intercepta cada peticion de la PWA
// Busca primero en el cache
// Si no esta, busca en internet
// En caso de falla, muestra la pagina offline.html
self.addEventListener("fetch", event => {
    event.respondWith(
        cache.match(event.request).then(response => {
            return response || fetch(event.request).catch (() => caches.match("offline.html"))
        })
    );
});

// 5. PUSH -> notificaciones en segundo plano 
// Manego de notificaciones push (opcional)
self.addEventListener("push", event => {
    const data = event.data ? event.data.text() : "Notificación sin texto"
    event. waitUntil(
        self.ServiceWorkerRegistration.showNotification("Mi PWA", {body: data})
    );
});