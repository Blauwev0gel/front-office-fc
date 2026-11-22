/* ================= Core: savegames with a schema version and migrations =================
   The whole world is one JSON object S. A save carries S.v; load() runs every migration from that version up to
   VERSION, in order. Rule: no VERSION bump without a migration and a test (tests/save-test.js). */
const MIGRATIONS={
  // 1 → 2: eight departments with staff levels (medical and grounds split off), season statistics per club
  2:s=>{for(const id in s.grounds){const d=s.grounds[id].depts,t=s.clubs[id].tier;
      d.medical=d.medical||{budget:d.training.budget,course:'prevention',pending:null,settle:0};
      d.grounds=d.grounds||{budget:d.matchday.budget,course:'stadium',pending:null,settle:0};
      for(const k in d){d[k].staff=d[k].staff??[3,2,1,1,1][t];d[k].hiring=d[k].hiring??null}}
    s.stats=s.stats||{};for(const id in s.clubs)s.stats[id]=s.stats[id]||{inj:0,injWeeks:0,youthGrowth:0,intake:0,intakeBest:0};
    s.v=2;},
  // 2 → 3: members, dues, confidence and season targets per club; the chairman's career
  3:s=>{s.members=s.members||{};for(const id in s.clubs){const c=s.clubs[id];s.members[id]=s.members[id]||{count:Math.round(c.support*.4),dues:[50,40,30,22,15][c.tier],conf:55,log:[],goals:[],goalsSeason:0,agm:null}}
    s.career=s.career||(s.my?[{club:s.my,from:1,to:null,why:null}]:[]);s.rep=s.rep||0;s.votedOut=s.votedOut||null;s.v=3;},
  // 3 → 4: head coaches and directors get a professional profile; the free pool is filled after loading (staffAfterLoad)
  4:s=>{s.staffPool=s.staffPool||[];s.v=4;},
  // 4 → 5: season budget, sponsor deals, members' financing (filled after loading: commercialAfterLoad)
  5:s=>{s.v=5;},
  // 5 → 6: player morale, cards, loans and transfer requests; club reputation
  6:s=>{const d=p=>{p.morale??=60;p.yel??=0;p.susp??=0;p.tired??=0;p.played??=0;p.loan??=null;p.wantsOut??=false;p.lowWeeks??=0};
    for(const id in s.squads)s.squads[id].forEach(d);(s.fa||[]).forEach(d);
    for(const id in s.clubs){const c=s.clubs[id];c.rep??=Math.round(Math.max(10,Math.min(95,[68,48,28,20,15][c.tier]+(c.support-[3000,1700,850,500,300][c.tier])/120)))}
    for(const id in s.fin)s.fin[id].policy.loans??=true;s.v=6;},
  // 6 → 7: club records and richer season history (filled after loading: projectsAfterLoad)
  7:s=>{s.records=s.records||{};s.v=7;},
  8:s=>{s.foreign=s.foreign||null;s.v=8;}
};
function migrate(s){
  if(!s||typeof s.v!=='number'||s.v<1)throw new Error('Not a Northmarch layered save');
  if(s.v>VERSION)throw new Error('This save comes from a newer version of the game');
  while(s.v<VERSION){const m=MIGRATIONS[s.v+1];if(!m)throw new Error('No migration to version '+(s.v+1));m(s);}
  return s;
}
/* Upgrade a legacy three-division world in place without discarding the chairman's
   season, finances, squad or existing fixtures. Lower divisions enter the pyramid.
   Previously played lower-tier matches are seeded as historical fixtures; they do
   not pay cash retroactively or trigger player injuries. */
function expandLegacyPyramid(){
  const ids=Object.keys(S.clubs);
  if(ids.length===80)return false;
  if(ids.length!==48||TIERS.slice(0,3).some(t=>ids.filter(id=>CL(id).tier===t).length!==16)){
    throw new Error('Unsupported legacy pyramid: expected three complete divisions of 16');
  }
  S.stats=S.stats||{};S.members=S.members||{};S.records=S.records||{};S.tbl=S.tbl||{};S.fx=S.fx||{};
  const used=new Set(ids.map(id=>CL(id).name));
  const towns=Object.keys(TOWNS);
  for(const tier of [3,4])for(let i=0;i<16;i++){
    const seedName=(TOWNNAMES.concat(TOWNNAMES2))[tier*16+i]||pick(TOWNNAMES);
    let name=seedName+' '+(i%3===0?'Vale':i%3===1?'Heath':'Town');
    let k=2;while(used.has(name))name=seedName+' '+(i%2?'Vale':'Heath')+' '+k++;
    used.add(name);
    const id='legacy_'+tier+'_'+i;
    const c=mkClub(id,name,pick(towns),tier);
    castClub(c);
    const [lo,hi]=TIER_STR[tier],str=ri(lo,hi);
    S.squads[id]=genSquad(str,id);
    S.grounds[id]=groundInit(id);
    S.fin[id]=finInit(id);
    S.stats[id]=statsInit();
    S.members[id]=membersInit(id);
    S.records[id]=recordsInit();
    giveProfile(c.cast.coach,'coach',tier);
    giveProfile(c.cast.td,'td',tier);
    commercialInit(id);
  }
  // Lower-division rivals must be selected after all sixteen clubs exist.
  for(const tier of [3,4])for(const id of tierIds(tier)){
    const rivals=tierIds(tier).filter(other=>other!==id);
    CL(id).rival=pick(rivals);
  }
  // Build schedules and reconstruct completed matchdays without resetting the existing season.
  for(const tier of [3,4]){
    const clubs=tierIds(tier);
    S.fx[tier]=makeFixtures(clubs);
    clubs.slice().sort((a,b)=>teamStrength(b)-teamStrength(a)).forEach((id,i)=>CL(id).expect=i+1);
    for(const id of clubs)S.tbl[id]={p:0,w:0,d:0,l:0,gf:0,ga:0,pts:0,ded:0,form:[]};
    for(let w=1;w<=Math.min(S.week||0,SEASON_WEEKS);w++)for(const [h,a] of S.fx[tier][w-1]){
      const [lh,la]=lambdas(teamStrength(h),teamStrength(a),true);
      const gh=pois(lh,rnd),ga=pois(la,rnd);
      rec(h,gh,ga);rec(a,ga,gh);
    }
  }
  // Preserve the original in-progress cup. Future seasons use all 80 clubs.
  if(S.cup)S.cup.legacy=true;
  S.legacyPyramidUpgrade={season:S.season,week:S.week,added:32};
  return true;
}
function schemaVersion(){return VERSION}
function serialize(){return JSON.stringify(S)}
function deserialize(txt){S=migrate(JSON.parse(txt));expandLegacyPyramid();for(const [id,sq] of Object.entries(S.squads))for(const p of sq)if(p.academy&&!p.originClub)p.originClub=p.loan?.from||p.club||id;if(!S.foreign)S.foreign=foreignInit();foreignRestoreCalendar();staffAfterLoad();commercialAfterLoad();projectsAfterLoad();membersAfterLoad();opsAfterLoad();youthAfterLoad();return S}
function save(){if(!HAS_DOM)return false;try{localStorage.setItem(SAVE_KEY,serialize());return true}catch(e){return false}}
function hasSave(){if(!HAS_DOM)return false;try{return!!localStorage.getItem(SAVE_KEY)}catch(e){return false}}
function load(){if(!HAS_DOM)return false;try{const t=localStorage.getItem(SAVE_KEY);if(!t)return false;deserialize(t);return true}catch(e){return false}}
