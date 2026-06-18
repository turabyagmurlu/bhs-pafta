/* BHS Service Worker — online: DAIMA taze HTML (network-first); offline: cache */
const C='bhs-cache-v2';
self.addEventListener('install', e=>self.skipWaiting());
self.addEventListener('activate', e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e=>{
  const req=e.request; if(req.method!=='GET') return;
  let url; try{ url=new URL(req.url); }catch(_){ return; }
  if(url.origin!==location.origin) return;            // CDN/Firebase'e dokunma
  const html = req.mode==='navigate' || url.pathname.endsWith('.html') || url.pathname.endsWith('/');
  if(!html) return;
  e.respondWith(
    fetch(req).then(res=>{ try{ const cp=res.clone(); caches.open(C).then(c=>c.put(req,cp)); }catch(_){ } return res; })
              .catch(()=>caches.match(req))
  );
});
