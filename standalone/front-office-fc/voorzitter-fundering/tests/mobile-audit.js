// Mobile audit on 390x844: tap targets, text sizes, primary action in reach, bottom bar, no sideways scroll,
// plus screenshots of the new screens. Usage: node build.js && node tests/mobile-audit.js
const {chromium}=require('playwright');const path=require('path');const fs=require('fs');
(async()=>{
 const f='file://'+path.resolve(__dirname,'../dist/index.html'),shots=path.join(__dirname,'shots');fs.mkdirSync(shots,{recursive:true});
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2});const errs=[];
 p.on('pageerror',e=>errs.push(e.message));
 const go=async(act,arg)=>{await p.click(`main [data-act="${act}"]${arg?`[data-arg="${arg}"]`:''}`)};
 // reach week 1
 const shotO=async n=>{await p.waitForTimeout(300);await p.screenshot({path:path.join(shots,'o-'+n+'.png'),fullPage:true});
   const r=await p.evaluate(()=>{const small=[],tiny=[];for(const el of document.querySelectorAll('button,a,input,[data-act]')){const b=el.getBoundingClientRect();if(!b.width||!b.height)continue;if(b.height<43.5||b.width<43.5)small.push((el.dataset.act||el.tagName)+':'+Math.round(b.width)+'x'+Math.round(b.height))}
     const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){if(!n.textContent.trim())continue;const el=n.parentElement;if(el.closest('svg'))continue;if(parseFloat(getComputedStyle(el).fontSize)<12.9)tiny.push(n.textContent.trim().slice(0,16))}return{small,tiny,wide:document.documentElement.scrollWidth}});
   console.log(('o-'+n).padEnd(16),'| small targets:',r.small.length?r.small.slice(0,3).join(' '):'none','| text <13px:',r.tiny.length?r.tiny.slice(0,3).join(' '):'none','| width',r.wide)};
 await p.goto(f);await shotO('title');await p.click('[data-act=new]');await shotO('call');await go('call');await shotO('seats');
 await p.click('main [data-act=seat]');await shotO('sign');await p.focus('main [data-hold]');await p.keyboard.press('Enter');await p.waitForTimeout(1500);await shotO('signed');await go('toEnvelope');await shotO('envelope');
 await go('openEnv');await shotO('envelope-open');await go('arrive');await shotO('speech');for(let i=0;i<3;i++){await p.click('main [data-act=pick]')}
 if(await p.$('main [data-act=crisis]')){await shotO('crisis');await p.click('main [data-act=crisis]');await shotO('crisis-done');await go('crisisDone')}
 await p.waitForTimeout(260);await p.screenshot({path:path.join(shots,'m-tdhire.png'),fullPage:true});const th=await p.evaluate(()=>[...document.querySelectorAll('main [data-act=tdhire]')].map(b=>Math.round(b.getBoundingClientRect().height)));console.log('tdhire     | hire buttons',th.join(','),'px');await p.click('main [data-act=tdhire]');
 await p.waitForTimeout(200);await p.screenshot({path:path.join(shots,'m-meeting.png'),fullPage:true});await go('meetNext');for(let i=0;i<6;i++)await p.click('main [data-act=mchoose]');await go('meetNext');await go('mdone');
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
 // the transfer summer: the running ticker, then the report
 await audit('sum-live');await go('sumSkip');await audit('sum-live-all');await go('sumNext');await audit('sum-report');
 await p.evaluate(()=>window.scrollTo(0,0));await p.screenshot({path:path.join(shots,'m-sum-report-full.png'),fullPage:true});await go('sumNext');
 await go('play');await go('next'); // week 2, with a result and form
 await audit('club');
 await p.evaluate(()=>window.scrollTo(0,0));await p.screenshot({path:path.join(shots,'m-club-full.png'),fullPage:true});
 await p.click('.tabbar [data-arg=post]');await audit('post');
 const sit=await p.$('main [data-act=sit]');if(sit){await sit.click();await audit('situation');await go('back')}
 await p.click('.tabbar [data-arg=room]');await audit('room');
 await p.click('.tabbar [data-arg=members]');await audit('members');
 await p.click('.tabbar [data-arg=staff]');await audit('staff');await p.screenshot({path:path.join(shots,'m-staff-full.png'),fullPage:true});
 await p.click('.tabbar [data-arg=club]');await go('play');await audit('result');
 await p.goto(f+'#style');await p.waitForTimeout(200);await p.screenshot({path:path.join(shots,'m-style.png'),fullPage:true});
 console.log('ERRORS',JSON.stringify(errs));await b.close();
})();
