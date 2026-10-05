// Mashina Hisobi — offline yordamchi. index.html bilan bir papkada turishi kerak.
const C='mashina-v13-4';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(['./','./index.html','./icon.png','./manifest.json']).catch(()=>{})));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  if(u.origin===location.origin){
    // har doim avval internetdan eng yangi versiya, bo'lmasa saqlangani
    e.respondWith(fetch(r.url,{cache:'no-cache'}).then(res=>{if(res.ok&&!u.search.includes('check=')){const cp=res.clone();caches.open(C).then(c=>c.put(u.pathname==='/'||u.pathname.endsWith('/')?'./':r,cp));}return res;})
      .catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('./index.html'))));return;}
  if(/fonts\.googleapis\.com|fonts\.gstatic\.com|cdn\.jsdelivr\.net/.test(u.host)){
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok||res.type==='opaque'){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));}return res;})));}
});
