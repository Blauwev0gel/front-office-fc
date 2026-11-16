const assert = require('assert'), vm = require('vm'), fs = require('fs');
const read = require('./src');
const modules = ['engine.js','events.js','events2.js','briefs.js','academy.js','academy2.js','recruit.js','summer.js','season.js','summer2.js','firstteam.js','depts.js','levers.js','commercial.js','marketing.js','business.js','academy3.js','recruitx.js','matchtalk.js','desk.js'];
const c = { console }; vm.createContext(c); vm.runInContext(modules.map(read).join('\n')+';this.FO=FO;',c); const F=c.FO;
function setup(){ F.newGame(42); const dna={}; for(const q of F.DNA)dna[q.k]=q.o[0].v; F.setDNA(dna,'Advice FC','ADV','Advice',['#123456','#ffffff']); for(const r of F.ROLES)F.hire(r.id,1); F.finishStaff();F.finishMandates(); F.G.board.obj=F.G.board.obj.filter(o=>o.k==='league'); F.G.phase='summer'; }
setup();
F.G.fin.revW=4;F.G.fin.revSum=F.playerWages()/0.69*4;F.G.mand.fin.wageCap='70';
let a=F.preAdvice();assert(a.some(x=>x.k==='wagecap'));assert(a.every(x=>x.why&&x.role&&x.action&&x.risk));const rs=F.G.rs;F.preAdvice();assert.equal(F.G.rs,rs,'rendering advice cannot consume randomness');
assert(F.preAcceptAdvice('wagecap'));assert.equal(F.G.pre.advice.wagecap.role,'fin');const saved=F.save();F.load(saved);assert(F.G.pre.focus.includes('wagecap'));assert.equal(F.G.pre.advice.wagecap.role,'fin');
assert(F.preAcceptAdvice('wagecap'));assert.equal(F.G.pre.focus.length,0,'withdrawal removes promise');
F.G.board.obj.push({k:'wagecap',target:0,t:'Existing cap'});assert(!F.preAdvice().some(x=>x.k==='wagecap'),'no duplicate board advice');assert(!F.preAcceptAdvice('profit'),'no arbitrary menu promises');
setup();F.G.mand.coach.youthMins=75;F.G.squad.slice(0,2).forEach(p=>{p.academy=true;p.age=19;p.st.apps=0;});F.G.club.dna.talent='smart';F.G.board.obj=F.G.board.obj.filter(o=>o.k!=='grads');assert(F.preAdvice().some(x=>x.k==='grads'),'real graduates plus youth mandate produce advice');
F.G.squad.forEach(p=>p.academy=false);F.G.fin.revW=4;F.G.fin.revSum=F.playerWages()/0.2*4;F.G.club.dna.identity='ideals';F.G.lastReport=null;assert.equal(F.preAdvice().length,0,'healthy club has no filler recommendations');
// Render the real helpers against the real engine. Existing saves still show optional commitments.
c.F=F;c.G=()=>F.G;c.esc=x=>String(x??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const ui=read('ui.js');const start=ui.indexOf('const WHO ='),end=ui.indexOf('function ddBlock',start);vm.runInContext(ui.slice(start,end)+';this.adviceHTML=seasonAdviceBlock;this.contextHTML=meetingContext;',c);
let html=c.adviceHTML();assert(html.includes('No extra target is justified'));assert(!html.includes('<details'));assert(!html.includes('Two focus goals'));assert(!html.includes('under-18 league'));
F.G.pre.focus=['profit'];html=c.adviceHTML();assert(html.includes('Earlier commitment'));assert(html.includes('Withdraw this extra commitment'));F.preAcceptAdvice('profit');assert.equal(F.G.pre.focus.length,0);
html=c.contextHTML([{who:'coach',t:'Need cover.'},{who:'scout',t:'Reports are uncertain.'},{who:'dof',t:'My plan.'}]);assert(html.includes('Need cover.'));assert(html.includes('Reports are uncertain.'));assert(!html.includes('My plan.'));assert(!html.includes('<details'));
// Snapshot the accepted target rather than moving it with later club growth.
setup();F.G.club.dna.identity='community';F.G.club.cap=12000;F.G.club.fanbase=1000;F.G.mand.mkt.budget=50;F.G.fin.revW=4;F.G.fin.revSum=1e6;F.G.board.obj=F.G.board.obj.filter(o=>o.k!=='fanbase');assert(F.preAdvice().some(x=>x.k==='fanbase'));F.preAcceptAdvice('fanbase');const target=F.G.pre.advice.fanbase.target;F.G.club.fanbase=2000;F.finishPreseason();assert.equal(F.G.board.obj.find(o=>o.k==='fanbase').target,target);assert.equal(F.G.board.obj.find(o=>o.k==='fanbase').owner,'mkt');
setup();F.G.pre.focus=[];F.finishPreseason();assert.equal(F.G.phase,'press','zero extra promises can proceed');
const summerUI=fs.readFileSync('src/ui/03-summer-preseason-press.js','utf8');assert(!summerUI.includes('<details'));assert(!summerUI.includes('P.focus.length === 2'));assert(summerUI.includes('data-a="s2-finish">'));
console.log('PASS: grounded advice, no duplicates, no RNG, explicit consent, optional goals, stable targets, save/load, visible context and legacy choices');
