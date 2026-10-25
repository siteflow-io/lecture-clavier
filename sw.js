// Lecture au clavier : la page gardée dans le téléphone. Elle s'ouvre ensuite tout de suite, même sans réseau (en tribune) ;
// une nouvelle version se télécharge en arrière-plan, puis la page propose de recharger.
const V='25/10/2026, 17 h 22',C='lecture-clavier-'+V,FICHIERS=["./", "index.html", "morceaux/bach-bwv565.json", "morceaux/gigout-toccata.json", "morceaux/boellmann-toccata.json", "morceaux/widor-adagio5.json", "morceaux/bach-bwv582.json", "morceaux/bach-bwv542.json", "morceaux/bach-bwv645.json", "morceaux/bach-bwv639.json", "morceaux/bach-bwv622.json", "morceaux/bach-bwv544.json", "morceaux/franck-prelude.json", "morceaux/mendelssohn-marche.json", "morceaux/scriabin-etude-op2-1.json", "donnees/sons.json", "donnees/faceLib.txt", "donnees/faceModels.txt", "donnees/pdfLib.txt", "donnees/pdfWork.txt"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FICHIERS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{const ks=(await caches.keys()).filter(k=>k!==C&&k.startsWith('lecture-clavier-'));await Promise.all(ks.map(k=>caches.delete(k)));await self.clients.claim();
if(ks.length)for(const cl of await self.clients.matchAll({type:'window'}))cl.postMessage({type:'nouvelle',version:V})})())});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
e.respondWith((async()=>{const c=await caches.open(C);const m=await c.match(r,{ignoreSearch:true});if(m)return m;
try{const n=await fetch(r);if(n.ok)c.put(r,n.clone());return n}catch(err){if(r.mode==='navigate'){const i=await c.match('./')||await c.match('index.html');if(i)return i}throw err}})())});
