// Mashina Hisobi — tez ochilish va internetsiz ishlash uchun yordamchi.
// Telefondagi nusxa darhol ko'rsatiladi, yangisi orqa fonda yuklanadi.
const C='mashina-v14';
const CORE=['./','./index.html','./tpl.json','./icon.png','./manifest.json'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>Promise.all(CORE.map(u=>c.add(new Request(u,{cache:'reload'})).catch(()=>{})))));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
function keyOf(u){const p=u.pathname;return p.endsWith('/')?'./':'.'+p.slice(p.lastIndexOf('/'));}
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  if(u.origin===location.origin){
    if(u.search.includes('check=')||u.search.includes('h='))return; // versiya tekshiruvi — har doim internetdan
    const key=keyOf(u);
    const net=fetch(u.pathname,{cache:'no-cache'}).then(res=>{if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(key,cp));}return res;});
    e.respondWith(caches.match(key).then(m=>{if(m){e.waitUntil(net.catch(()=>{}));return m;}return net.catch(()=>caches.match('./index.html'));}));
    return;}
  if(/fonts\.googleapis\.com|fonts\.gstatic\.com|cdn\.jsdelivr\.net/.test(u.host)){
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok||res.type==='opaque'){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));}return res;})));}
});
