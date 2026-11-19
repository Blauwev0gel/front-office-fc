/* ================= RNG and helpers ================= */
let S=null;const UI={over:null,tab:'tables',lobby:{}};
function rnd(){let t=(S.rs=(S.rs+0x6D2B79F5)|0);t=Math.imul(t^(t>>>15),1|t);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296}
function mkRng(seed){let s=seed|0;return()=>{let t=(s=(s+0x6D2B79F5)|0);t=Math.imul(t^(t>>>15),1|t);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296}}
const pick=a=>a[Math.floor(rnd()*a.length)],ri=(a,b)=>a+Math.floor(rnd()*(b-a+1));
function pickN(a,n){const c=a.slice(),o=[];while(o.length<n&&c.length)o.push(c.splice(Math.floor(rnd()*c.length),1)[0]);return o}
function pois(l,r){const L=Math.exp(-l);let k=0,p=1;do{k++;p*=r()}while(p>L);return k-1}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function ord(n){const s=['th','st','nd','rd'],v=n%100;return n+(s[(v-20)%10]||s[v]||s[0])}
const P=id=>S.P[id], CL=id=>S.clubs[id], C=()=>S.clubs[S.my];
function gname(c,k){return k==='workers'?TOWNS[c.town].wk:ARCH[k].n}
