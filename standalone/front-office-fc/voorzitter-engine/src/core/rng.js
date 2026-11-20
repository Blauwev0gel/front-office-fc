// Seeded toeval. Alle toeval loopt via S.rs (opgeslagen in de save), nooit Math.random.
function rnd(S){let t=(S.rs=(S.rs+0x6D2B79F5)|0);t=Math.imul(t^(t>>>15),1|t);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296}
function ri(S,a,b){return a+Math.floor(rnd(S)*(b-a+1))}
function chance(S,p){return rnd(S)<p}
function pick(S,arr){return arr[Math.floor(rnd(S)*arr.length)]}
