// Browser QA using Chrome DevTools directly (no Playwright dependency).
// node test/browser/retro-runtime.cjs, after python3 build.py. Requires Node 22 + Chrome.
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const http=require('node:http'),cp=require('node:child_process');
const file=fs.readFileSync(path.join(__dirname,'../../dist/index.html'));
const snooze=ms=>new Promise(r=>setTimeout(r,ms));
const chromeBin=[process.env.TEST_BROWSER,'/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable','/usr/bin/chromium','/usr/bin/chromium-browser']
  .filter(Boolean).find(fs.existsSync);
assert(chromeBin,'Real Chrome/Chromium required for mobile contrast QA');
const server=http.createServer((req,res)=>{
  res.setHeader('Content-Type','text/html; charset=utf-8');res.end(file);
});
let chrome,profile,ws;
function contrastAudit(){
  const parse=c=>{const m=String(c).match(/[\d.]+/g);return m?[+m[0],+m[1],+m[2],m[3]==null?1:+m[3]]:[0,0,0,0];};
  const lum=c=>c.slice(0,3).map(v=>{v/=255;return v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4);})
    .reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
  const bg=e=>{
    const a=[];for(let p=e;p;p=p.parentElement)a.unshift(p);
    let color=[233,235,230];
    for(const p of a){const c=parse(getComputedStyle(p).backgroundColor);
      color=color.map((v,i)=>v*(1-c[3])+c[i]*c[3]);}
    return color;
  };
  let count=0;const low=[];
  for(const e of document.querySelectorAll('#app *')){
    const st=getComputedStyle(e),r=e.getBoundingClientRect();
    if(st.display==='none'||st.visibility!=='visible'||+st.opacity<.45||r.width<2||r.height<2)continue;
    if(e.closest('[hidden],[aria-hidden="true"],button:disabled,[role=button][aria-disabled=true]'))continue;
    const text=Array.from(e.childNodes).filter(n=>n.nodeType===Node.TEXT_NODE&&n.textContent.trim().length>1);
    if(!text.length)continue;
    const col=parse(st.color),back=bg(e);if(col[3]<.5)continue;
    const front=col.slice(0,3).map((v,i)=>v*col[3]+back[i]*(1-col[3]));
    const a=lum(front),b=lum(back),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);
    const large=parseFloat(st.fontSize)>=24||(parseFloat(st.fontSize)>=18.5&&parseInt(st.fontWeight,10)>=700);
    count++;
    if(ratio<(large?3:4.5)-.07)low.push({
      tag:e.tagName,cls:String(e.className).slice(0,75),
      text:text.map(n=>n.textContent.trim()).join(' ').slice(0,80),
      ratio:+ratio.toFixed(2),fg:st.color,bg:back.map(Math.round)});
  }
  return {count,low:low.slice(0,14),issues:low.length,overflow:document.documentElement.scrollWidth-innerWidth};
}
function installFixture(){
  FO.defineEvent('qa_one_tap',{forced:1,ceo:1,from:'dof',dept:'sporting',
    title:'QA direct reply',body:'One decision must execute on first tap.',
    opts:[{l:'Approve the proposal',f:()=>{FO.G.flags.qaTap=(FO.G.flags.qaTap||0)+1;return 'Approved once.';}},
          {l:'Decline',f:()=>{FO.G.flags.qaTap=(FO.G.flags.qaTap||0)+1;return 'Declined once.';}}]});
  FO.addMsg('qa_one_tap',{});
  document.querySelector('[data-a="tab"][data-t="club"]').click();
  document.querySelector('[data-a="tab"][data-t="inbox"]').click();
  const r=[...document.querySelectorAll('.rbr')].find(e=>e.textContent.includes('QA direct reply'));
  if(!r)throw Error('QA event missing from inbox');r.click();
  return {options:document.querySelectorAll('.mreply .srow').length,
    draft:document.querySelectorAll('[data-a="msend"],[data-a="mpick"]').length};
}
function verifyReply(){
  const m=FO.G.inbox.find(x=>x.ev==='qa_one_tap');
  const saved=JSON.parse(localStorage.getItem('frontoffice_save_v1_chatgpt'));
  return {done:m.done,choice:m.choice,count:FO.G.flags.qaTap,
    sent:!!document.querySelector('.msent'),
    saved:saved.inbox.some(x=>x.ev==='qa_one_tap'&&x.done)};
}
async function main(){
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  profile=fs.mkdtempSync(path.join(os.tmpdir(),'retro-wireframe-'));
  chrome=cp.spawn(chromeBin,['--headless=new','--no-sandbox','--disable-gpu',
    '--disable-dev-shm-usage','--remote-allow-origins=*','--remote-debugging-port=0',
    '--no-first-run','--user-data-dir='+profile,'about:blank'],{stdio:'ignore'});
  let port;
  for(let i=0;i<160;i++){
    try{port=Number(fs.readFileSync(path.join(profile,'DevToolsActivePort'),'utf8').split('\n')[0]);break;}
    catch{await snooze(100);}
  }
  assert(port,'Chrome DevTools did not start');
  const tabs=await(await fetch('http://127.0.0.1:'+port+'/json/list')).json();
  const page=tabs.find(t=>t.type==='page');assert(page);
  ws=new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((ok,bad)=>{ws.onopen=ok;ws.onerror=bad;});
  let id=0;const pending=new Map(),exceptions=[];
  ws.onmessage=e=>{
    const m=JSON.parse(e.data);
    if(m.method==='Runtime.exceptionThrown')exceptions.push(m.params?.exceptionDetails?.text||'Page exception');
    const cb=pending.get(m.id);if(!cb)return;pending.delete(m.id);
    m.error?cb[1](Error(m.error.message)):cb[0](m.result);
  };
  function call(method,params={}){
    return new Promise((yes,no)=>{
      const key=++id;pending.set(key,[yes,no]);ws.send(JSON.stringify({id:key,method,params}));
    });
  }
  async function evaluate(s){
    const r=await call('Runtime.evaluate',{expression:s,returnByValue:true,awaitPromise:true});
    if(r.exceptionDetails)throw Error('Browser: '+(r.exceptionDetails.exception?.description||r.exceptionDetails.text));
    return r.result?.value;
  }
  async function wait(expr){
    for(let i=0;i<90;i++){try{if(await evaluate(expr))return;}catch(e){}await snooze(80);}
    throw Error('UI did not reach '+expr);
  }
  const click=s=>evaluate('(()=>{const b=document.querySelector('+JSON.stringify(s)+');'+
    'if(!b)throw Error("Button missing: "+'+JSON.stringify(s)+');b.click();return true})()');
  async function audit(name,width=390){
    await call('Emulation.setDeviceMetricsOverride',
      {width,height:844,deviceScaleFactor:1,mobile:width<=500});
    await snooze(70);
    const report=await evaluate('('+contrastAudit.toString()+')()');
    assert(report&&report.count>10,name+' no rendered content');
    assert(report.overflow<=2,name+' '+width+'px overflow '+report.overflow);
    assert.equal(report.issues,0,name+' low contrast '+JSON.stringify(report.low));
  }
  await call('Page.enable');await call('Runtime.enable');
  await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await call('Page.navigate',{url:'http://127.0.0.1:'+server.address().port+'/front-office-fc/chatgpt/'});
  await wait('document.readyState==="complete"&&!!document.querySelector(\'[data-a="new"]\')');
  await audit('title');await click('[data-a="new"]');await audit('founding');
  await click('[data-a="sheet"][data-s="quick"]');
  await click('[data-a="quick"][data-v="season"]');
  await wait('typeof FO!=="undefined"&&FO.G&&FO.G.phase==="season"');
  await audit('inbox');
  for(const tab of ['club','squad','league','staff','inbox']){
    await click('[data-a="tab"][data-t="'+tab+'"]');await audit(tab);
  }
  for(const width of [320,390,768])await audit('inbox',width);
  await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  const fixture=await evaluate('('+installFixture.toString()+')()');
  assert.deepEqual(fixture,{options:2,draft:0});
  await audit('reply options');
  await click('.mreply .srow[data-i="0"]');
  const outcome=await evaluate('('+verifyReply.toString()+')()');
  assert.deepEqual(outcome,{done:true,choice:0,count:1,sent:true,saved:true});
  await audit('sent reply');await click('[data-a="mnext"]');await audit('after reply');
  await click('[data-a="play"]');await wait('!!document.querySelector(\'[data-a="md-kick"]\')');
  await audit('match preview');await click('[data-a="md-kick"]');
  await wait('!!document.querySelector(\'[data-a="md-skip"]\')');
  await audit('match commentary');await click('[data-a="md-skip"]');
  await wait('!!document.querySelector(\'[data-a="md-after"]\')');
  await audit('full time');await click('[data-a="md-after"]');
  if(await evaluate('!!document.querySelector(\'[data-a="md-skip"]\')')){
    await click('[data-a="md-skip"]');await click('[data-a="md-after"]');
  }
  await wait('!!document.querySelector(\'[data-a="md-done"]\')');
  await audit('Gazette');
  assert.deepEqual(exceptions,[],'uncaught browser errors');
  console.log('PASS: Chrome mobile/desktop contrast, no overflow, direct one-tap/save and full match flow');
}
main().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{
  if(ws){try{ws.close();}catch(e){}}
  if(chrome){chrome.kill('SIGTERM');await snooze(500);}
  await new Promise(ok=>server.close(ok));
  if(profile){try{fs.rmSync(profile,{recursive:true,force:true,maxRetries:4,retryDelay:120});}catch(e){}}
});
