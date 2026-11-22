// L3 S3.2: factual window reporting and director-specific retrospective trust.
const {loadEngine}=require('./load.js');
const E=loadEngine();
let failed=0;
function ok(c,msg){console.log((c?'ok   ':'FAIL ')+msg);if(!c)failed++}
E.newWorld(101);
E.chooseClub(E.__get().seats[0]);
E.__get().agmOff=true;
const id=E.__get().my;
E.advanceWeek();
let S=E.__get(),reports=S.ops.reports;
ok(reports.length===1&&reports[0].kind==='Summer'&&reports[0].s===1&&reports[0].w===0,'real summer window has one persistent report');
ok(reports[0].directorPid===S.clubs[id].cast.td,'report is attributed to director identity');
ok(E.directorTrust().n===0,'without observed signings the director has no invented trust score');
// Supply three known current squad players as controlled retrospective observations.
// The window report remains a snapshot: assessments are created only after actual appearances.
const ps=S.squads[id].slice(0,3),tdid=S.clubs[id].cast.td;
ok(ps.length===3,'real club has at least three players for the evidence fixture');
reports[0].signed=ps.map((p,i)=>({pid:p.id,name:p.name,pos:p.pos,s:S.season,w:0,
  est:p.q+(i===2?3:0),q0:p.q,directorPid:tdid,fee:0,need:'Test observation'}));
E.directorAuditWeek();
ok(reports[0].signed.every(x=>!x.assessment),'a signing is not assessed immediately after joining');
for(const p of ps)p.sApps=8;
E.directorAuditWeek();
ok(reports[0].signed.every(x=>x.assessment?.apps>=8),'eight real appearance counters freeze each assessment');
let trust=E.directorTrust();
ok(trust.n===3&&trust.hits===2&&trust.label==='Earned confidence','trust uses the original estimate and verified sample count');
const snapshots=reports[0].signed.map(x=>JSON.stringify(x.assessment));
E.directorAuditWeek();
ok(reports[0].signed.every((x,i)=>JSON.stringify(x.assessment)===snapshots[i]),'repeated weekly observations do not double-score signings');
// Season rollover resets live player statistics but must not erase past observations.
for(const p of ps){p.history.push({season:S.season,club:id,apps:8,cupApps:0,europe:0});p.sApps=0;}
S.season++;
const idle=S.squads[id][3];
reports[0].signed.push({pid:idle.id,name:idle.name,pos:idle.pos,s:1,w:0,
  est:idle.q,q0:idle.q,directorPid:tdid,fee:0,need:'Bench cover'});
ok(E.directorWindowReviews()[0].players.some(x=>x.pid===idle.id&&x.verdict==='Limited involvement'),
  'an unused signing after a full season is flagged rather than silently called successful');
ok(E.directorWindowReviews()[0].assessed===3&&E.directorTrust().n===3,'reports and trust survive a season stats reset');
const saved=E.serialize();
E.deserialize(saved);
S=E.__get();
ok(E.directorTrust().n===3&&E.directorWindowReviews()[0].meeting===2,'reports and frozen evidence survive save/load');
const replacement=S.staffPool.find(pid=>S.P[pid].role==='td'&&pid!==tdid);
ok(!!replacement,'there is another director in the staff pool');
S.clubs[id].cast.td=replacement;
ok(E.directorTrust().n===0,'a newly appointed director does not inherit predecessor performance');
S.clubs[id].cast.td=tdid;
// Old save without S3.2 fields loads without inventing recruitment evaluations.
const old=JSON.parse(E.serialize());delete old.ops.reports;
E.deserialize(JSON.stringify(old));
ok(Array.isArray(E.__get().ops.reports)&&E.__get().ops.reports.length===0,'legacy save without reports initializes safely');
// The second window is produced by the real clock, without duplicate reports.
const W=loadEngine();
W.newWorld(72);W.chooseClub(W.__get().seats[0]);W.__get().agmOff=true;
for(let w=0;w<15;w++)W.advanceWeek();
const wr=W.__get().ops.reports;
ok(wr.length===2&&wr[0].kind==='Summer'&&wr[0].w===0&&wr[1].kind==='Winter'&&wr[1].w===15,
  'real summer and winter windows each close with one correctly dated report');
ok(new Set(wr.map(x=>x.s+'-'+x.w)).size===wr.length,'window reports have unique season/week keys');
console.log(failed?`l3-s32-test: ${failed} failed`:'l3-s32-test: all checks passed');
process.exit(failed?1:0);
