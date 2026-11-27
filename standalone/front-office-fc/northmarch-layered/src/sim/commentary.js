/* ================= Simulation: the match told minute by minute =================
   The match engine has already decided the game (score, scorers, expected goals, who played). This module only TELLS it:
   a timeline of chances, goals and commentary that always ends in the real result. It uses its own generator seeded from the
   match itself, never rnd(), so watching a match changes nothing in the world and the same match always reads the same.
   Nothing here is stored: matchStory(m) is recomputed whenever it is shown. No cards or injuries are invented: only real ones. */
const CHANCE_KINDS=[['save',.34],['off',.28],['block',.2],['post',.06],['miss',.12]];
function storySeed(m){return hashStr(`${S.season}|${S.week}|${m.comp}|${m.round||0}|${m.h}|${m.a}`)}
function storyPlayer(pid){const f=findPlayer(pid);return f?f.p:{id:pid,name:'a player',pos:'CM',q:10}}
function lastName(p){const n=String(p.name||'a player').split(' ');return n.length>1?n.slice(1).join(' '):n[0]}
const SC_POS={GK:0,CB:.5,FB:.5,DM:.6,CM:1.4,AM:2.6,W:2.8,ST:5};
function weighted(r,xs,fn){const tot=xs.reduce((a,x)=>a+fn(x),0)||1;let v=r()*tot;for(const x of xs){v-=fn(x);if(v<=0)return x}return xs[xs.length-1]}
function sidePos(side,r,kind){ /* where on the pitch the ball is: the home side attacks to the right (x 100) */
  const att=kind==='goal'||kind==='save'||kind==='post'||kind==='miss'||kind==='block'||kind==='off'||kind==='corner';
  const x=att?(kind==='goal'?96+r()*2:80+r()*14):45+r()*10,y=kind==='corner'?(r()<.5?6:94):28+r()*44;
  return{x:side==='h'?x:100-x,y};
}
const T_SHOT={save:['{p} lets fly from the edge of the box, but {gk} gets down to save.','{p} meets it first time. {gk} is equal to it.','{p} cuts inside and shoots: a good stop from {gk}.','A flat drive from {p}, and {gk} parries it away.'],
  off:['{p} has a go from distance. It sails over the bar.','{p} gets the shot away but drags it wide.','{p} snatches at it and puts it well off target.','Chance for {p}, but the finish is poor.'],
  block:['{p} shoots, and a defender throws himself in the way.','{p} pulls the trigger. Blocked on the line of the six-yard box.','The shot from {p} is charged down.'],
  post:['{p} hits the woodwork! {gk} was beaten all the way.','Off the post from {p}! The ground gasps.','{p} thunders it against the bar. So close.'],
  miss:['{p} has an open goal to aim at and somehow misses it!','Huge chance for {p}, six yards out, and he puts it wide.','{p} is clean through and {gk} smothers it at his feet.']};
const T_GOAL=['GOAL! {p} finishes it off for {t}.','GOAL! {p} finds the net! {t} have scored.','{p} scores! A cool, composed finish.','GOAL for {t}! {p} gets on the end of it.'];
const T_ASSIST=[' Set up by {a}.',' The pass came from {a}.',' {a} did the hard work.'],T_NOASSIST=[' A fine individual effort.',' He took it all the way himself.',' It came off a loose ball in the box.'];
const T_QUIET=['An even spell. Neither side finds a way through.','The game settles into a midfield battle.','{t} keep the ball well but cannot break the other side down.','Neither goalkeeper has much to do at the moment.','{t} are pressing high and winning the ball back.','A scrappy period. Plenty of fouls, few chances.'];
function fill(s,o){return s.replace(/\{(\w+)\}/g,(_,k)=>o[k]??'')}
function matchStory(m){
  const r=mkRng(storySeed(m)),pk=a=>a[Math.floor(r()*a.length)];
  const names={h:CL(m.h).name,a:CL(m.a).name},xi={h:(m.xiH||[]).map(storyPlayer),a:(m.xiA||[]).map(storyPlayer)};
  const gk=s=>(xi[s].find(p=>p.pos==='GK')||{name:'the keeper'}),gkName=s=>lastName(gk(s));
  const seen={},pu=(k,a)=>{const u=seen[k]||(seen[k]=[]),left=a.filter(x=>!u.includes(x)),c=pk(left.length?left:a);u.push(c);return c}; /* no sentence twice in one match until the list is used up */
  const ev=[],push=e=>ev.push({o:ev.length,...e});
  const goals={h:m.scorers.filter(s=>s.side==='h'),a:m.scorers.filter(s=>s.side==='a')};
  const used=new Set(),minute=(lo,hi)=>{let t=0,v;do{v=Math.round(lo+r()*(hi-lo));t++}while(used.has(v)&&t<12);used.add(v);return v};
  /* goals: the real scorers, at invented minutes */
  for(const side of ['h','a'])for(const g of goals[side]){const p=storyPlayer(g.pid),mates=xi[side].filter(x=>x.id!==g.pid&&x.pos!=='GK'),as=r()<.62&&mates.length?weighted(r,mates,x=>SC_POS[x.pos]+.6):null;
    push({min:minute(2,93),t:'goal',side,pid:g.pid,p:p.name,a:as?as.name:null,xg:.1+r()*.6,...sidePos(side,r,'goal')})}
  /* the other chances: more of them for the side with the higher expected goals */
  for(const side of ['h','a']){const l=side==='h'?m.lh:m.la,n=Math.max(1,Math.round(l*3.6+(r()-.5)*3));
    for(let i=0;i<n;i++){const kind=weighted(r,CHANCE_KINDS,k=>k[1])[0],sh=weighted(r,xi[side].filter(x=>x.pos!=='GK'),x=>SC_POS[x.pos]+.3),
      xg={save:.08+r()*.22,off:.03+r()*.12,block:.05+r()*.15,post:.12+r()*.2,miss:.35+r()*.25}[kind];
      push({min:minute(3,92),t:kind,side,pid:sh.id,p:sh.name,xg,...sidePos(side,r,kind)})}
    if(r()<.55)push({min:minute(10,88),t:'corner',side,xg:0,...sidePos(side,r,'corner')})}
  /* real injuries of this week only */
  for(const e of S.ev)if(e.t==='Injury'&&e.s===S.season&&e.w===S.week&&(e.c===m.h||e.c===m.a)){const f=findPlayer(e.pid);if(f&&(xi.h.some(p=>p.id===e.pid)||xi.a.some(p=>p.id===e.pid)))push({min:minute(12,80),t:'injury',side:e.c===m.h?'h':'a',pid:e.pid,p:f.p.name,weeks:e.weeks,xg:0,x:50,y:50})}
  ev.sort((x,y)=>x.min-y.min||x.o-y.o);
  /* expected goals: scaled so the match total is the engine's own number */
  for(const side of ['h','a']){const es=ev.filter(e=>e.side===side&&e.xg),sum=es.reduce((a,e)=>a+e.xg,0),l=side==='h'?m.lh:m.la,k=sum?clamp(l/sum,.02,12):1; /* a side with few chances that still scores: its chances shrink to the engine's total */for(const e of es)e.xg=e.xg*k}
  /* the text, with the running score */
  let sh=0,sa=0;const out=[];
  out.push({min:0,t:'start',side:null,text:`Kick-off at ${CL(m.h).ground||'the ground'}. ${names.h} against ${names.a}.`,x:50,y:50,xg:0});
  let prev=0,halfDone=false;
  const quiet=min=>{const t=pu('quiet',T_QUIET);out.push({min,t:'note',side:null,text:fill(t,{t:names[r()<.5?'h':'a']}),x:40+r()*20,y:30+r()*40,xg:0})};
  for(const e of ev){
    if(!halfDone&&e.min>45){out.push({min:45,t:'half',side:null,text:`Half time: ${names.h} ${sh}–${sa} ${names.a}.`,x:50,y:50,xg:0,sh,sa});halfDone=true;prev=45}
    if(e.min-prev>14){quiet(Math.round(prev+(e.min-prev)/2))}
    let text='';const o={p:lastName({name:e.p}),t:names[e.side==='h'?'h':'a'],gk:gkName(e.side==='h'?'a':'h'),a:e.a?lastName({name:e.a}):''};
    if(e.t==='goal'){const lead=(e.side==='h'?sh:sa)-(e.side==='h'?sa:sh);if(e.side==='h')sh++;else sa++;
      const sit=sh+sa===1?` ${names[e.side]} take the lead.`:sh===sa?` It is all square again: ${sh}–${sa}.`:lead>=0&&Math.abs(sh-sa)>=2?` ${sh}–${sa}: ${names[e.side]} are in control.`:e.min>=80?` Late, late goal. It is ${sh}–${sa}.`:` ${sh}–${sa}.`;
      text=fill(pu('goal',T_GOAL),o)+(e.a?fill(pk(T_ASSIST),o):fill(pk(T_NOASSIST),o))+sit;e.sh=sh;e.sa=sa}
    else if(e.t==='corner')text=`${names[e.side]} win a corner. ${pk(['It is cleared at the near post.','The delivery is cut out.','Dangerous, but it comes to nothing.'])}`;
    else if(e.t==='injury')text=`${e.p} is down and has to be treated. He is out for ${e.weeks} week${e.weeks>1?'s':''}.`;
    else text=fill(pu(e.t,T_SHOT[e.t]),o);
    out.push({...e,text,sh,sa});prev=e.min;
  }
  if(!halfDone)out.push({min:45,t:'half',side:null,text:`Half time: ${names.h} ${[...ev].filter(e=>e.t==='goal'&&e.min<=45&&e.side==='h').length}–${[...ev].filter(e=>e.t==='goal'&&e.min<=45&&e.side==='a').length} ${names.a}.`,x:50,y:50,xg:0});
  out.sort((x,y)=>x.min-y.min);
  const fin=`Full time: ${names.h} ${m.gh}–${m.ga} ${names.a}.`;
  const endMin=Math.max(90,...out.map(e=>e.min));
  out.push({min:endMin,t:'end',side:null,text:fin,x:50,y:50,xg:0,sh:m.gh,sa:m.ga});
  /* a cup tie that stays level goes to a shoot-out; the winner is already decided, only the kicks are told */
  let pens=null;
  if(m.pens){const win=m.pens===m.h?'h':'a',los=win==='h'?'a':'h',w=3+Math.floor(r()*3),l=Math.max(0,w-1-Math.floor(r()*2)),kick=(side,i,sc)=>{const k=xi[side].filter(p=>p.pos!=='GK')[i%10];return sc?`${lastName(k)} scores.`:`${lastName(k)} ${pk(['hits the post.','sees it saved by '+gkName(side==='h'?'a':'h')+'.','blazes it over.'])}`}
    const seq=[];for(let i=0;i<5;i++)for(const side of ['h','a']){const tot=side===win?w:l,done=seq.filter(s=>s.side===side&&s.sc).length,left=5-seq.filter(s=>s.side===side).length;seq.push({side,sc:done<tot&&(tot-done>=left||r()<.7),i})}
    const hs=seq.filter(s=>s.side==='h'&&s.sc).length,as=seq.filter(s=>s.side==='a'&&s.sc).length;pens={h:hs,a:as,seq:seq.map(s=>({side:s.side,sc:s.sc,text:kick(s.side,s.i,s.sc)}))};
    out.push({min:endMin+1,t:'pens',side:win,text:`Level after ninety minutes: penalties. ${names[win]} win the shoot-out ${Math.max(hs,as)}–${Math.min(hs,as)}.`,x:50,y:50,xg:0,sh:m.gh,sa:m.ga})}
  /* pressure through the game: who has the ball, nudged by every chance */
  const share=m.lh/(m.lh+m.la),mom=[];let v=share;
  for(let t=1;t<=90;t++){v+=(share-v)*.12+(r()-.5)*.09;let b=0;for(const e of ev){if(Math.abs(e.min-t)<=3&&e.xg)b+=(e.side==='h'?1:-1)*e.xg*.18*(1-Math.abs(e.min-t)/4)}mom.push(clamp(v+b,.08,.92))}
  const stat=side=>{const es=ev.filter(e=>e.side===side&&['goal','save','off','block','post','miss'].includes(e.t));return{shots:es.length,on:es.filter(e=>['goal','save','post'].includes(e.t)).length,xg:r2(es.reduce((a,e)=>a+e.xg,0))}};
  for(const e of out)e.xg=r2(e.xg);
  return{h:m.h,a:m.a,names,events:out,mom,pens,stats:{h:stat('h'),a:stat('a')},final:{h:m.gh,a:m.ga}};
}
