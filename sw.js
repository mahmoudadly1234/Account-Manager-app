const C='finapp-v17';
const FILES=['./','index.html','manifest.json','icon-192.png','icon-512.png','apple-touch-icon.png','i18n-dict.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim()});
// Only cache the app's own files and libraries. Never touch Supabase data or sign-in traffic.
const cacheable=u=>u.origin===self.location.origin||u.host==='cdn.jsdelivr.net'||u.host==='cdnjs.cloudflare.com'||u.host==='fonts.googleapis.com'||u.host==='fonts.gstatic.com';
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||!cacheable(u))return;
  e.respondWith(fetch(e.request).then(r=>{if(r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp))}return r}).catch(()=>caches.match(e.request,{ignoreSearch:true})));
});
