/* ================= Taps: one handler for every data-act, then save and redraw ================= */
function say(r,okText){UI.msg=r&&r.ok===false?{err:true,text:r.err}:okText?{text:okText}:null}
function act(a,arg){
  UI.msg=null;
  switch(a){
    case'new':newWorld((Date.now()%2147483647)|0);UI.title=false;UI.tab='week';UI.review=null;break;
    case'cont':if(load()){UI.title=false;UI.review=null}break;
    case'quit':save();UI.title=true;UI.over=null;break;
    case'choose':chooseClub(arg);UI.tier=null;break;
    case'boardjump':UI.tab='club';UI.ct={members:'members',staff:'football',departments:'depts'}[arg]||'overview';UI.over=null;break; // kept for old links
    case'ctab':UI.tab='club';UI.ct=arg;UI.over=null;UI.gsel=null;UI.confirm=null;if(arg==='ground')UI.gt=UI.gt||'stadium';if(HAS_DOM)window.scrollTo(0,0);break;
    case'helpok':S.help=true;break;
    case'journal':UI.over='journal';break;
    case'tab':UI.tab=arg;UI.over=null;if(arg==='money')UI.mt=UI.mt||'overview';if(HAS_DOM)window.scrollTo(0,0);break;
    case'play':{UI.prevPos=S.week?posOf(S.my):null;const ev=advanceWeek();UI.lastEv=ev||[];if(HAS_DOM)window.scrollTo(0,0);break}
    case'close':{const mark=S.evn||0;const h=closeSeason();UI.summerEv=eventsSince(mark);UI.review=h;UI.lastEv=[];if(HAS_DOM)window.scrollTo(0,0);break}
    case'startnext':UI.review=null;UI.tab='week';break;
    case'tier':UI.tier=['cup','market','archive'].includes(arg)?arg:+arg;break;
    case'ov':UI.over=arg||null;UI.gsel=null;UI.confirm=null;if(arg==='ground')UI.gt='stadium';break;
    case'club':UI.over='club';UI.arg=arg;break;
    case'dept':UI.over='dept';UI.arg=arg;UI.gsel=null;break;
    case'dstaff':{const [dept,lv]=arg.split(':');say(cmd('SetDeptStaff',S.my,{dept,level:+lv}));break}
    case'player':UI.over='player';UI.arg=arg;UI.confirm=null;break;
    case'gtab':UI.gt=arg;UI.gsel=null;break;
    case'mtab':UI.mt=arg;break;
    case'gsel':UI.gsel=arg||null;break;
    case'gbuild':{const [key,offer]=arg.split('|');const r=cmd('StartProject',S.my,{key,offer});say(r,'Building work ordered.');if(r.ok)UI.gsel=null;break}
    case'grepair':say(cmd('Repair',S.my,{key:arg}),'Repaired.');break;
    case'gdept':{const [dept,level]=arg.split(':');say(cmd('SetDeptBudget',S.my,{dept,level}));break}
    case'gcourse':{const [dept,course]=arg.split(':');say(cmd('SetDeptCourse',S.my,{dept,course}));break}
    case'price':{const [kind,d]=arg.split(':');say(cmd('SetPrice',S.my,{kind,delta:+d}));break}
    case'ly':UI.ly=+arg;break;
    case'loan':say(cmd('TakeLoan',S.my,{amount:+arg,years:UI.ly}),`£${arg}k borrowed.`);break;
    case'repay':say(cmd('RepayLoan',S.my,{i:+arg}),'Loan repaid.');break;
    case'staff':UI.over='staff';UI.arg=arg;UI.confirm=null;break;
    case'shire':{const [role,pid]=arg.split('|');const r=cmd('HireStaff',S.my,{role,pid});say(r,'Appointed.');if(r.ok)UI.confirm=null;break}
    case'ssack':say(cmd('SackStaff',S.my,{role:arg}),'Sacked. A caretaker takes over.');break;
    case'srenew':say(cmd('RenewStaff',S.my,{role:arg}),'Contract renewed.');break;
    case'history':UI.over='history';break;
    case'buyplot':say(cmd('BuyPlot',S.my,{}),'Land bought.');UI.confirm=null;break;
    case'stadium':say(cmd('StartStadium',S.my,{size:arg}),'Work on the new stadium has started.');UI.confirm=null;break;
    case'mtabgo':UI.tab='money';UI.mt=arg==='sponsors'||arg==='prices'?'income':arg;UI.over=null;if(HAS_DOM)window.scrollTo(0,0);break;
    case'tobudget':UI.tab='money';UI.mt='budget';UI.over=null;if(HAS_DOM)window.scrollTo(0,0);break;
    case'wager':say(cmd('SetSquadPolicy',S.my,{wageR:clamp(r2(wageRatio(S.my)+.02*(+arg)),.4,1.05)}));break;
    case'sponsor':say(cmd('SignSponsor',S.my,{i:+arg}),'Deal signed.');break;
    case'bond':say(cmd('IssueBond',S.my,{amount:+arg}),'Bond issued.');break;
    case'appeal':{const r=cmd('Fundraise',S.my,{});say(r,r.ok?`The appeal raised £${r.res}k.`:null);break}
    case'sellground':say(cmd('SellGround',S.my,{}),'The ground is sold.');UI.confirm=null;break;
    case'buyback':say(cmd('BuyBackGround',S.my,{}),'The ground is ours again.');break;
    case'dues':say(cmd('SetDues',S.my,{delta:+arg}));break;
    case'pol':say(cmd('SetSquadPolicy',S.my,{wage:arg}));break;
    case'loans':say(cmd('SetSquadPolicy',S.my,{loans:arg==='true'}));break;
    case'spend':say(cmd('SetSquadPolicy',S.my,{spend:+arg}));break;
    case'confirm':UI.confirm=arg||null;break;
    case'release':{const r=cmd('ReleasePlayer',S.my,{pid:arg});say(r);if(r.ok){UI.over=null;UI.confirm=null}break}
  }
  if(S&&!UI.title&&(S.phase!=='choose'||S.career.length))save();
  render();
}
if(HAS_DOM){
  document.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b)return;act(b.dataset.act,b.dataset.arg)});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&UI.over){UI.over=null;render()}});
  render();
}
