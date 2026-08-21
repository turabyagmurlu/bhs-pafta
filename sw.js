/* BHS service worker — AG ONCE (network-first), cevrimdisi yedek onbellek */
var C="bhs-cache-v4";
self.addEventListener("install",function(e){ self.skipWaiting(); });
self.addEventListener("activate",function(e){ e.waitUntil(caches.keys().then(function(k){ return Promise.all(k.map(function(x){ return (x===C)?null:caches.delete(x); })); }).then(function(){ return self.clients.claim(); })); });
self.addEventListener("fetch",function(e){
  var r=e.request;
  if(r.method!=="GET") return;
  var u;
  try{ u=new URL(r.url); }catch(err){ return; }
  if(u.origin!==self.location.origin) return;
  e.respondWith(
    fetch(r).then(function(res){
      try{ var k=res.clone(); caches.open(C).then(function(c){ c.put(r,k); }); }catch(err){}
      return res;
    }).catch(function(){
      return caches.match(r).then(function(m){ return m || caches.match(r.url.split("?")[0]).then(function(m2){ return m2 || new Response("Cevrimdisi",{status:503}); }); });
    })
  );
});
