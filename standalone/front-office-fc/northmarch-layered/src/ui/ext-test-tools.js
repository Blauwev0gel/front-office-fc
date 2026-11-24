/* ================= UI extension, ported from Northmarch V19 =================
   Standalone export, save transfer and display diagnostics (test tools).
   Ported verbatim: these layers wrap core functions (render, act, cmd, ...) instead of using the feature hooks.
   Do not add new behaviour here; convert to hooks module by module. */
/* Standalone export, save transfer, and display diagnostics — no game-rule changes. */
(function(){
  if(typeof document==='undefined')return;
  const q=id=>document.getElementById(id);
  const status=msg=>{const e=q('nm-tool-status');if(e)e.textContent=msg};
  function makeFile(content,mime,name){
    const blob=new Blob([content],{type:mime});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');a.href=url;a.download=name;a.style.display='none';document.body.appendChild(a);
    a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),120000);return url;
  }
  function documentSource(){
    const clone=document.documentElement.cloneNode(true);
    const app=clone.querySelector('#app');
    if(app)app.replaceChildren();
    const modal=clone.querySelector('.overlay');
    if(modal)modal.remove();
    return '<!DOCTYPE html>\n'+clone.outerHTML;
  }
  document.addEventListener('click',e=>{
    const button=e.target.closest('[data-nm-tool]');if(!button)return;
    e.preventDefault();const which=button.dataset.nmTool;
    try{
      if(which==='download'){
        makeFile(documentSource(),'text/html;charset=utf-8','Northmarch_V18_3_Matchday_Echo.html');
        status('De HTML-download is gestart. Open het bestand buiten de embed om te testen.');
      }
      else if(which==='open'){
        const u=URL.createObjectURL(new Blob([documentSource()],{type:'text/html'}));
        const win=window.open(u,'_blank','noopener,noreferrer');
        if(!win)status('Nieuw venster geblokkeerd. Gebruik Download standalone HTML.');
      }
      else if(which==='export'){
        if(!S){status('Er is nog geen spel begonnen.');return}
        makeFile(serialize(),'application/json;charset=utf-8','Northmarch_save_S'+S.season+'_W'+S.week+'.json');
        status('Save-export gestart.');
      }
      else if(which==='import')q('nm-save-import').click();
    }catch(err){status('Niet toegestaan in deze ingebedde browser: '+String(err.message||err)+'. Probeer de pagina in Safari/Chrome te openen.');}
  });
  q('nm-save-import')?.addEventListener('change',async e=>{
    const f=e.target.files?.[0];if(!f)return;
    try{
      const content=await f.text();JSON.parse(content);deserialize(content);
      UI.title=false;UI.review=null;UI.over=null;UI.tab='week';save();render();
      status('Save geladen. Controleer de Week-tab.');
    }catch(err){status('Deze save kan niet geladen worden: '+String(err.message||err))}
    e.target.value='';
  });
})();
