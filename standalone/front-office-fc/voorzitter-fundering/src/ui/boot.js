/* ================= Input, save, boot ================= */
function save(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(S))}catch(e){}}
function load(){try{const t=localStorage.getItem(SAVE_KEY);if(t){const s=JSON.parse(t);if(s&&s.v===1){S=s;return true}}}catch(e){}return false}
if(HAS_DOM){
  document.addEventListener('change',e=>{const id=e.target.dataset&&e.target.dataset.lobby;if(id){UI.lobby[id]=e.target.checked;render()}});
  document.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b)return;const a=b.dataset.act,arg=b.dataset.arg;
    if(a==='ov'){UI.over=arg||null;if(arg==='region')UI.tab='tables';render();return}
    if(a==='tab'){UI.tab=arg;render();return}
    if(a==='tab2'){UI.t=arg;render();window.scrollTo(0,0);return}
    if(a==='player'){UI.over='player';UI.pid=arg;render();return}
    if(a==='continue'){if(load())render();return}
    if(b.dataset.hold){if(e.detail===0){act(b.dataset.hold);save();render();window.scrollTo(0,0)}return}
    if(a==='call'){act('call',(document.getElementById('nm')||{}).value);save();render();window.scrollTo(0,0);return}
    if(a==='new'){UI.lobby={};UI.over=null;act('new');}
    else if(a==='lobbyDone'){act('lobbyDone',Object.keys(UI.lobby).filter(k=>UI.lobby[k]));UI.lobby={}}
    else act(a,arg);
    save();render();if(a!=='frame'&&a!=='react')window.scrollTo(0,0);});
  // hold to sign: press and hold about a second
  let holdT=null;document.addEventListener('pointerdown',e=>{const b=e.target.closest('[data-hold]');if(!b)return;e.preventDefault();b.classList.add('go');holdT=setTimeout(()=>{act(b.dataset.hold);save();render();window.scrollTo(0,0)},matchMedia('(prefers-reduced-motion: reduce)').matches?150:950)});
  const holdStop=()=>{clearTimeout(holdT);document.querySelectorAll('[data-hold].go').forEach(x=>x.classList.remove('go'))};document.addEventListener('pointerup',holdStop);document.addEventListener('pointercancel',holdStop);
  const boot=data=>{if(data&&data.S)S=data.S;render()};
  window.addEventListener('hashchange',render);
  window.claude?.hot?.snapshot?.(()=>({S}));
  window.claude?.hot?.ready?window.claude.hot.ready(boot):boot(window.claude?.hot?.data??{});
}
if(typeof module!=='undefined')module.exports={act,get S(){return S},set S(v){S=v},currentScene,sceneCards,manifestOptions,sitBuild,P,C,weighted,myPos,pdef};
