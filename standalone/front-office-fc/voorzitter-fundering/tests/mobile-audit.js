// Mobile audit on 390x844: tap targets, text sizes, primary action in reach, bottom bar, no sideways scroll,
// plus screenshots of the new screens. Usage: node build.js && node tests/mobile-audit.js
const {chromium}=require('playwright');const path=require('path');const fs=require('fs');
(async()=>{
 const f='file://'+path.resolve(__dirname,'../dist/index.html'),shots=path.join(__dirname,'shots');fs.mkdirSync(shots,{recursive:true});
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2});const errs=[];
 p.on('pageerror',e=>errs.push(e.message));
 await p.goto(f);await p.click('[data-act=new]');
 const go=async(act,arg)=>{await p.click(`main [data-act="${act}"]${arg?`[data-arg="${arg}"]`:''}`)};
 // reach week 1
 await go('toSeats');await p.click('main [data-act=seat]');await go('arrive');for(let i=0;i<3;i++){await p.click('main [data-act=pick]')}
 await p.waitForTimeout(260);await p.screenshot({path:path.join(shots,'m-tdhire.png'),fullPage:true});const th=await p.evaluate(()=>[...document.querySelectorAll('main [data-act=tdhire]')].map(b=>Math.round(b.getBoundingClientRect().height)));console.log('tdhire     | hire buttons',th.join(','),'px');await p.click('main [data-act=tdhire]');
 await go('meetNext');for(let i=0;i<6;i++)await p.click('main [data-act=mchoose]');await go('meetNext');await go('mdone');
 const audit=async(name)=>{
   await p.waitForTimeout(260);
   const r=await p.evaluate(()=>{const out={small:[],tiny:[],wide:document.documentElement.scrollWidth,nav:!!document.querySelector('.tabbar'),primary:null};
     for(const el of document.querySelectorAll('button,a,[data-act],summary,label.check')){const b=el.getBoundingClientRect();if(b.width===0||b.height===0)continue;if(el.closest('.overlay')&&!document.querySelector('.overlay'))continue;if(b.height<44-0.5||b.width<44-0.5)out.small.push((el.dataset.act||el.tagName)+':'+Math.round(b.width)+'x'+Math.round(b.height))}
     const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while(n=walker.nextNode()){if(!n.textContent.trim())continue;const el=n.parentElement;if(el.closest('svg'))continue;const fs=parseFloat(getComputedStyle(el).fontSize);if(fs<13-0.1)out.tiny.push(el.tagName+':'+fs+':'+n.textContent.trim().slice(0,20))}
     const pr=document.querySelector('.btn.primary');if(pr){const b=pr.getBoundingClientRect();out.primary=Math.round(b.top/innerHeight*100)}
     return out});
   await p.screenshot({path:path.join(shots,`m-${name}.png`),fullPage:false});
   console.log(name.padEnd(10),'| small targets:',r.small.length?r.small.slice(0,4).join(' '):'none','| text <13px:',r.tiny.length?r.tiny.slice(0,3).join(' '):'none','| primary at',r.primary==null?'—':r.primary+'% of screen height','| bottom bar:',r.nav?'yes':'no','| width',r.wide);
 };
 // the transfer summer: review, plan, four weeks (answer a talking point if there is one), deadline, balance
 await audit('sum-review');await go('sumNext');await audit('sum-plan');await go('sumNext');
 for(let w=1;w<=4;w++){if(w===1||await p.$('main [data-act=talk]')){await audit('sum-week'+w)}const t=await p.$('main [data-act=talk]');if(t)await t.click();await go('sumNext')}
 await audit('sum-deadline');await go('sumNext');await audit('sum-balance');await go('sumNext');
 await go('play');await go('next'); // week 2, with a result and form
 await audit('club');
 await p.evaluate(()=>window.scrollTo(0,0));await p.screenshot({path:path.join(shots,'m-club-full.png'),fullPage:true});
 await p.click('.tabbar [data-arg=post]');await audit('post');
 const sit=await p.$('main [data-act=sit]');if(sit){await sit.click();await audit('situation');await go('back')}
 await p.click('.tabbar [data-arg=room]');await audit('room');
 await p.click('.tabbar [data-arg=members]');await audit('members');
 await p.click('.tabbar [data-arg=club]');await go('play');await audit('result');
 await p.goto(f+'#style');await p.waitForTimeout(200);await p.screenshot({path:path.join(shots,'m-style.png'),fullPage:true});
 console.log('ERRORS',JSON.stringify(errs));await b.close();
})();
