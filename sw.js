var CACHE='saehan-v10';
var BASE='/Quotation';
self.addEventListener('install',function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(c){
      return c.addAll([BASE+'/',BASE+'/index.html',BASE+'/manifest.json',BASE+'/icon-192.png',BASE+'/icon-512.png']);
    })
  );
  self.skipWaiting();
});
self.addEventListener('activate',function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
    })
  );
  self.clients.claim();
});
self.addEventListener('fetch',function(e){
  e.respondWith(
    caches.match(e.request).then(function(c){
      return c||fetch(e.request).then(function(r){
        var cl=r.clone();
        caches.open(CACHE).then(function(ca){ca.put(e.request,cl);});
        return r;
      });
    }).catch(function(){
      return caches.match(BASE+'/index.html');
    })
  );
});