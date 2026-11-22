// Match story: light checks that the told match is the real match (seconds).
const {loadEngine}=require('./load.js');
const E=loadEngine();let fails=0;const ok=(c,m)=>{console.log((c?'ok   ':'FAIL ')+m);if(!c)fails++};
E.newWorld(8123);const S=E.__get();E.chooseClub('pell');
let n=0,badGoals=0,badNames=0,badXg=0,badOrder=0,notDet=0,pens=0,badPens=0;const rs0=S.rs;
for(let w=0;w<8;w++){E.advanceWeek();const rsAfterWeek=S.rs;
  for(const m of S.matches){const st=E.matchStory(m),st2=E.matchStory(m);n++;
    const gh=st.events.filter(e=>e.t==='goal'&&e.side==='h').length,ga=st.events.filter(e=>e.t==='goal'&&e.side==='a').length;
    if(gh!==m.gh||ga!==m.ga)badGoals++;
    const sc=m.scorers.map(s=>s.pid).sort().join(),tl=st.events.filter(e=>e.t==='goal').map(e=>e.pid).sort().join();if(sc!==tl)badNames++;
    if(Math.abs(st.stats.h.xg-m.lh)>.06||Math.abs(st.stats.a.xg-m.la)>.06)badXg++;
    for(let i=1;i<st.events.length;i++)if(st.events[i].min<st.events[i-1].min)badOrder++;
    if(JSON.stringify(st)!==JSON.stringify(st2))notDet++;
    if(m.pens){pens++;const w2=m.pens===m.h?st.pens.h>st.pens.a:st.pens.a>st.pens.h;if(!w2)badPens++}
    if(S.rs!==rsAfterWeek){console.log('rng moved');fails++}}}
ok(n>50,`stories told for ${n} matches`);
ok(!badGoals,'every story has exactly the real score');ok(!badNames,'the goals are scored by the real scorers');
ok(!badXg,'the story\'s expected goals equal the engine\'s');ok(!badOrder,'events run in order of the clock');
ok(!notDet,'the same match always reads the same');ok(!badPens,`a shoot-out always ends in the real winner's favour (${pens})`);
console.log(fails?`story-test: ${fails} failed`:'story-test: all checks passed');process.exit(fails?1:0);
