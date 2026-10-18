/* BHS Service Worker v3 (PWA) — HTML: network-first (daima taze, offline'da cache);
   uygulama kabuğu (js, ikon, manifest, drone görseli): önbellek, arkada yenile. CDN/Firebase'e dokunulmaz. */
const C='bhs-cache-v3';
const KABUK=['./','./index.html','./panel.html','./saha-raporlari.html','./hakedis.js','./guard.js','./isi.js',
  './manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png','./bhs-drone.jpg'];
self.addEventListener('install', e=>{ e.waitUntil(caches.open(C).then(c=>Promise.allSettled(KABUK.map(u=>c.add(u)))).then(()=>self.skipWaiting())); });
self.addEventListener('activate', e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch', e=>{
  const req=e.request; if(req.method!=='GET') return;
  let url; try{ url=new URL(req.url); }catch(_){ return; }
  if(url.origin!==location.origin) return;
  const html = req.mode==='navigate' || url.pathname.endsWith('.html') || url.pathname.endsWith('/');
  if(html){
    e.respondWith(fetch(req).then(res=>{ try{ const cp=res.clone(); caches.open(C).then(c=>c.put(req,cp)); }catch(_){} return res; })
      .catch(()=>caches.match(req,{ignoreSearch:true}).then(r=>r||caches.match('./index.html'))));
    return;
  }
  e.respondWith(caches.match(req,{ignoreSearch:true}).then(hit=>{
    const net=fetch(req).then(res=>{ try{ if(res.ok){ const cp=res.clone(); caches.open(C).then(c=>c.put(req,cp)); } }catch(_){} return res; }).catch(()=>hit);
    return hit||net;
  }));
});
