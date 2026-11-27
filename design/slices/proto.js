/* Northmarch slices: shared shell on top of the real engine (engine.js). No game rules live here.
   The year runs on the engine's clock (advanceWeek, closeSeason); the chairman acts through cmd() and momentChoose().
   This file only paces the year in months (bible §4a: the chairman's year), stops the clock when he is needed,
   and shows the engine's own moments and AGM. */
const Y={
  k(v){v=+v||0;const s=v<0?'−':'',a=Math.abs(v);return s+'£'+(a>=1000?(a/1000).toFixed(a>=10000?1:2).replace(/\.?0+$/,'')+'m':Math.round(a)+'k')},
  esc(s){return String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))},
  /* the 30 league weeks laid over the football year; WINTER_WEEK (15) is January */
  MONTHS:[[3,'August'],[6,'September'],[9,'October'],[12,'November'],[14,'December'],[17,'January'],[20,'February'],[23,'March'],[27,'April'],[30,'May']],
  monthOf(w){if(!w)return'June';const m=Y.MONTHS.find(x=>w<=x[0]);return m?m[1]:'May'},
  nextStop(w){const m=Y.MONTHS.find(x=>x[0]>w);return m?m[0]:SEASON_WEEKS},
  seed(){const m=(location.hash||'').match(/seed(\d+)/);return m?+m[1]:1+Math.floor(Math.random()*99998)},
  boot(seed,pick){newWorld(seed);const id=pick(S.seats.slice());chooseClub(id);Y.mark=S.evn||0;Y.cash=[{w:0,v:F(id).cash}];Y.log=[];Y.news=[];return id},
  /* the club's own news since the last look */
  fresh(){const ev=eventsSince(Y.mark).filter(e=>e.c===S.my&&e.text&&e.t!=='Command'&&e.t!=='WeekClosed');Y.mark=S.evn||0;Y.news=ev.concat(Y.news).slice(0,60);return ev},
  note(t){Y.log.push({s:S.season,w:S.week,m:Y.monthOf(S.week),t})},
  /* play weeks until the month ends, the season ends, or someone needs the chairman. stop(w) may return a reason. */
  playMonth(stop){
    const to=Y.nextStop(S.week);let why=null;
    while(S.week<to&&!seasonOver()){
      advanceWeek();Y.cash.push({w:S.week,v:F(S.my).cash});
      if(S.moment){why='moment';break}
      const r=stop&&stop(S.week);if(r){why=r;break}
    }
    return {why,news:Y.fresh()};
  },
  /* ---------- pieces of page ---------- */
  who(name,role,line,face){const f=face||String(name).split(' ').map(w=>w[0]).join('').slice(0,2);return`<div class="who"><div class="face">${Y.esc(f)}</div><div><div class="name">${Y.esc(name)}</div><div class="role">${Y.esc(role)}</div>${line?`<q>${line}</q>`:''}</div></div>`},
  rows(list){return`<div class="rows">${list.filter(Boolean).map(([a,b,cls])=>`<div class="row"><span>${a}</span><span class="r ${cls||''}">${b}</span></div>`).join('')}</div>`},
  bar(){const id=S.my;if(!id)return;document.getElementById('barClub').textContent=CL(id).name;document.getElementById('barDiv').textContent=TIER_NAME[CL(id).tier];
    document.getElementById('barCash').textContent=Y.k(F(id).cash)+' cash';
    document.getElementById('barClock').textContent=`${Y.monthOf(S.week)} · season ${S.season}${S.week?` · ${ord(posOf(id))}`:''}`},
  newsHtml(list,max=8){const l=(list||Y.news).slice(0,max);return l.length?`<div class="feed">${l.map(e=>`<div><span class="t">wk ${e.w??''}</span><span>${Y.esc(e.text)}</span></div>`).join('')}</div>`:'<p class="muted">Quiet.</p>'},
  /* the engine's moment, as it is: who, what, and for every option what you give, what you get and how it is tested */
  momentHtml(){const m=S.moment;if(!m)return'';
    return`<div class="sec"><h2 class="bad">${Y.esc(m.title)}</h2>${Y.who(m.who,m.role,Y.esc(m.text))}
      <div class="stack">${m.opts.map((o,i)=>`<div class="choice"><button class="btn" data-act="moment" data-i="${i}">${Y.esc(o.label)}</button>
        <div class="price">${o.give&&o.give!=='—'?`You give: ${Y.esc(o.give)}. `:''}${o.get&&o.get!=='—'?`You get: ${Y.esc(o.get)}. `:''}${o.test&&o.test!=='—'?`Tested: ${Y.esc(o.test)}. `:''}${o.fail&&o.fail!=='—'?`If not: ${Y.esc(o.fail)}.`:''}</div></div>`).join('')}</div></div>`},
  chooseMoment(i){const t=S.moment&&S.moment.title,o=S.moment&&S.moment.opts[i];const r=momentChoose(i);if(r.ok)Y.note(`${t}: ${o.label}.`);Y.fresh();return r},
  /* a small line chart: plan against what happened (both in £k) */
  chart(plan,actual,floor){const W=320,H=120,all=plan.map(p=>p.v).concat(actual.map(a=>a.v)).concat(floor!=null?[floor]:[]),lo=Math.min(0,...all),hi=Math.max(...all,1),x=w=>8+w/SEASON_WEEKS*(W-16),y=v=>H-14-(v-lo)/(hi-lo||1)*(H-28);
    const path=pts=>pts.map((p,i)=>(i?'L':'M')+x(p.w).toFixed(1)+' '+y(p.v).toFixed(1)).join(' ');
    return`<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Cash: plan against actual">
      <line x1="8" x2="${W-8}" y1="${y(0)}" y2="${y(0)}" stroke="var(--line)"/>
      ${floor!=null?`<line x1="8" x2="${W-8}" y1="${y(floor)}" y2="${y(floor)}" stroke="var(--bad)" stroke-dasharray="3 3"/><text x="${W-8}" y="${y(floor)-3}" text-anchor="end" font-size="9" fill="var(--bad)" font-family="IBM Plex Mono,monospace">4 weeks of wages</text>`:''}
      <path d="${path(plan)}" fill="none" stroke="var(--muted)" stroke-width="1.5" stroke-dasharray="4 3"/>
      <path d="${path(actual)}" fill="none" stroke="var(--accent)" stroke-width="2.5"/>
      ${actual.length?`<circle cx="${x(actual[actual.length-1].w)}" cy="${y(actual[actual.length-1].v)}" r="3.5" fill="var(--accent)"/>`:''}
      <text x="8" y="10" font-size="9" fill="var(--muted)" font-family="IBM Plex Mono,monospace">${Y.k(hi)}</text>
      <text x="8" y="${H-2}" font-size="9" fill="var(--muted)" font-family="IBM Plex Mono,monospace">Aug</text><text x="${W-8}" y="${H-2}" text-anchor="end" font-size="9" fill="var(--muted)" font-family="IBM Plex Mono,monospace">May</text>
    </svg><p class="muted" style="font-size:12px">Dashed: the June forecast. Solid: the cash in the bank.</p>`},
  /* the AGM as the engine held it */
  agmHtml(h){const a=h&&h.agm;if(!a)return'<p>No AGM.</p>';const id=a.club;
    return`<div class="sec"><h2>The AGM · season ${a.s}</h2>
      ${Y.rows(a.goals.map(g=>[Y.esc(g.text),g.met?'met':'missed · '+Y.esc(g.now),g.met?'good':'bad']))}
      <h3>Why the members voted as they did</h3>${Y.rows((a.reasons||[]).map(([t,d])=>[Y.esc(t),(d>0?'+':'')+Math.round(d),d>0?'good':'bad']))}
      <h3>By group</h3>${Y.rows(agmTally(id).map(g=>[`${Y.esc(g.n)} <span class="muted">(${g.share}% of the vote)</span>`,g.pct+'% for',g.pct>=50?'good':'bad']))}
      <div class="echo"><div class="head ${a.out?'bad':'good'}">${a.for}% for · ${a.out?'Voted out':'Re-elected'}</div></div></div>`},
  logHtml(){return Y.log.length?Y.rows(Y.log.map(l=>[`<span class="muted">${l.m}</span> ${Y.esc(l.t)}`,''])):'<p class="muted">You decided nothing this season.</p>'},
};
