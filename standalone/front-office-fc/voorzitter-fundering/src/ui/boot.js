/* ================= Input, save, boot ================= */
function save(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(S))}catch(e){}}
function load(){try{const t=localStorage.getItem(SAVE_KEY);if(t){const s=JSON.parse(t);if(s&&s.v===1){S=s;return true}}}catch(e){}return false}
if(HAS_DOM){
  document.addEventListener('change',e=>{const id=e.target.dataset&&e.target.dataset.lobby;if(id){UI.lobby[id]=e.target.checked;render()}});
  document.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b)return;const a=b.dataset.act,arg=b.dataset.arg;
    if(a==='ov'){UI.over=arg||null;if(arg==='region')UI.tab='tables';render();return}
    if(a==='tab'){UI.tab=arg;render();return}
    if(a==='continue'){if(load())render();return}
    if(a==='new'){UI.lobby={};UI.over=null;act('new');}
    else if(a==='lobbyDone'){act('lobbyDone',Object.keys(UI.lobby).filter(k=>UI.lobby[k]));UI.lobby={}}
    else act(a,arg);
    save();render();if(a!=='frame')window.scrollTo(0,0);});
  const boot=data=>{if(data&&data.S)S=data.S;render()};
  window.claude?.hot?.snapshot?.(()=>({S}));
  window.claude?.hot?.ready?window.claude.hot.ready(boot):boot(window.claude?.hot?.data??{});
}
if(typeof module!=='undefined')module.exports={act,get S(){return S},set S(v){S=v},currentScene,sceneCards,electionScene,manifestOptions,sitBuild,P,C,weighted,myPos,pdef};
