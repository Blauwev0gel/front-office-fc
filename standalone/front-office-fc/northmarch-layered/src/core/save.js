/* ================= Core: savegames with a schema version and migrations =================
   The whole world is one JSON object S. A save carries S.v; load() runs every migration from that version up to
   VERSION, in order. Rule: no VERSION bump without a migration and a test (tests/save-test.js). */
const MIGRATIONS={
  // 1 → 2: eight departments with staff levels (medical and grounds split off), season statistics per club
  2:s=>{for(const id in s.grounds){const d=s.grounds[id].depts,t=s.clubs[id].tier;
      d.medical=d.medical||{budget:d.training.budget,course:'prevention',pending:null,settle:0};
      d.grounds=d.grounds||{budget:d.matchday.budget,course:'stadium',pending:null,settle:0};
      for(const k in d){d[k].staff=d[k].staff??[3,2,1][t];d[k].hiring=d[k].hiring??null}}
    s.stats=s.stats||{};for(const id in s.clubs)s.stats[id]=s.stats[id]||{inj:0,injWeeks:0,youthGrowth:0,intake:0,intakeBest:0};
    s.v=2;},
  // 2 → 3: members, dues, confidence and season targets per club; the chairman's career
  3:s=>{s.members=s.members||{};for(const id in s.clubs){const c=s.clubs[id];s.members[id]=s.members[id]||{count:Math.round(c.support*.4),dues:[50,40,30][c.tier],conf:55,log:[],goals:[],goalsSeason:0,agm:null}}
    s.career=s.career||(s.my?[{club:s.my,from:1,to:null,why:null}]:[]);s.rep=s.rep||0;s.votedOut=s.votedOut||null;s.v=3;},
  // 3 → 4: head coaches and directors get a professional profile; the free pool is filled after loading (staffAfterLoad)
  4:s=>{s.staffPool=s.staffPool||[];s.v=4;}
};
function migrate(s){
  if(!s||typeof s.v!=='number'||s.v<1)throw new Error('Not a Northmarch layered save');
  if(s.v>VERSION)throw new Error('This save comes from a newer version of the game');
  while(s.v<VERSION){const m=MIGRATIONS[s.v+1];if(!m)throw new Error('No migration to version '+(s.v+1));m(s);}
  return s;
}
function serialize(){return JSON.stringify(S)}
function deserialize(txt){S=migrate(JSON.parse(txt));staffAfterLoad();membersAfterLoad();return S}
function save(){if(!HAS_DOM)return false;try{localStorage.setItem(SAVE_KEY,serialize());return true}catch(e){return false}}
function hasSave(){if(!HAS_DOM)return false;try{return!!localStorage.getItem(SAVE_KEY)}catch(e){return false}}
function load(){if(!HAS_DOM)return false;try{const t=localStorage.getItem(SAVE_KEY);if(!t)return false;deserialize(t);return true}catch(e){return false}}
