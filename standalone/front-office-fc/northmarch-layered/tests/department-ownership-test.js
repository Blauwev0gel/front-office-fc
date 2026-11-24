// Ported from Northmarch V19 (northmarch/test/department-ownership.js): the home, the department sheets, real construction, the stadium, finances, the match newspaper, save and mobile CSS.
const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const {ENGINE_BASE,UI_BASE}=require('../build.js');
const root=path.resolve(__dirname,'..');
/* the default (L1/L2) game: engine and UI modules in the order of the build */
const js=ENGINE_BASE.concat(UI_BASE).map(f=>fs.readFileSync(path.join(root,'src',f),'utf8')).join('\n');
function game(){return vm.runInNewContext(js+';({newWorld,chooseClub,getS:()=>S,UI,weekView,deptSheet,groundBody,moneyView,act,deptFacility,projectCatalog,G,serialize,deserialize})')}
const g=game();
g.newWorld(1804);g.chooseClub(g.getS().seats[0]);g.UI.title=false;g.UI.v183Stage='preview';g.UI.tab='week';
const home=g.weekView();
assert.equal((home.match(/class="nm85-tile"/g)||[]).length,13);
assert(!home.includes('nm86-upgrade-cta'),'No generic upgrade CTA on home');
assert(!home.includes('nm86-cash'),'Cashflow belongs in Finances');
for(const k of ['training','medical','academy','scouting','commercial','community','matchday']){
 const html=g.deptSheet(k);
 assert(html.includes('Facility & investment'),k+' missing facility');
 assert(html.includes('People & staffing'),k+' missing people controls');
 assert(!html.includes('Open full department report'),k+' should not require an extra page');
 assert(g.deptFacility(g.getS().my,k),k+' missing mapped facility');
}
g.UI.over='dept';g.UI.arg='training';
const id=g.getS().my,fac=g.deptFacility(id,'training'),opt=fac.opt;
assert(opt,'Missing training project');
g.act('gsel',opt.key);assert(g.deptSheet('training').includes('Approve investment'));
g.act('gbuild',opt.key+'|standard');
assert(g.G(id).projects.some(p=>p.key===opt.key&&p.phase!=='done'),'Approval did not start project');
assert(g.deptSheet('training').includes('Under construction'));
g.UI.over='ground';g.UI.gt='stadium';
assert(g.groundBody().includes('Grounds team & maintenance'));
g.UI.gt='build';
const ground=g.groundBody();
assert(ground.includes('Investments'));
assert(!ground.includes('data-arg="plot:'),'Department plot projects must not appear in Stadium');
assert(ground.includes('data-arg="fac:access"'),'Stadium must offer turnstiles');
g.UI.over=null;g.UI.tab='money';g.UI.mt='overview';
assert(g.moneyView().includes('nm86-cash'),'Cashflow absent from Finances');
g.UI.tab='week';g.act('play');
assert.equal(g.UI.v183Stage,'result');
g.act('v183paper');
assert(g.weekView().includes('THE NORTHMARCH ECHO'));
g.act('v183ready');
assert(g.weekView().includes('nm85-home'));
const saved=g.serialize(),club=g.getS().my;
g.deserialize(saved);assert.equal(g.getS().my,club);
const css=fs.readFileSync(path.join(root,'src/style/main.css'),'utf8')+fs.readFileSync(path.join(root,'src/style/extensions.css'),'utf8');
assert(css.includes('@media(max-width:430px)'));
console.log('PASS: department ownership, real construction, stadium, finance, match newspaper, save, mobile CSS');
