// Mashina Hisobi — offline yordamchi. index.html bilan bir papkada turishi kerak.
// Avval internetdan eng yangi versiya olinadi; internet 4 soniyada javob bermasa yoki yo'q bo'lsa — telefondagi nusxa.
const C='mashina-v14-1';
const WAIT=4000;
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(['./','./index.html','./icon.png','./manifest.json']).catch(()=>{})));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  if(u.origin===location.origin){
    if(u.search.includes('check='))return;
    const key=u.pathname.endsWith('/')?'./':r;
    const net=fetch(r.url,{cache:'no-cache'}).then(res=>{if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(key,cp));}return res;});
    e.respondWith(new Promise(resolve=>{
      let done=false;const finish=v=>{if(!done&&v){done=true;resolve(v);}};
      net.then(finish).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>finish(m||caches.match('./index.html'))));
      setTimeout(()=>caches.match(r,{ignoreSearch:true}).then(m=>{if(m)finish(m);}),WAIT);
    }));
    e.waitUntil(net.catch(()=>{}));
    return;}
  if(/fonts\.googleapis\.com|fonts\.gstatic\.com|cdn\.jsdelivr\.net/.test(u.host)){
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok||res.type==='opaque'){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));}return res;})));}
});
