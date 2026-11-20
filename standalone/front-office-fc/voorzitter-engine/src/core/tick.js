// De wekelijkse tick. Fasen in vaste volgorde (ENGINE §6); elke fase hoort bij één laag.
// Stap 1: alleen het raamwerk. Laag 1 en 2 registreren hun fasen in stap 2 en 3; de andere lagen
// worden in stap 4 vervangen door vaste neutrale invoer.
const PHASES=['agents','initiatives','match','finance','members','people','dynasty','thresholds','report'];
const HANDLERS={}; PHASES.forEach(p=>HANDLERS[p]=[]);
function onPhase(phase,layer,fn){if(!HANDLERS[phase])throw new Error('unknown phase '+phase);HANDLERS[phase].push({layer,fn})}
function emit(S,name,val){S.sig[name]=val}
function signal(S,name,dflt){return name in S.sig?S.sig[name]:dflt}
function logBook(S,layer,text){S.log.push({season:S.season,week:S.week,layer,text})}
function tick(S){
  S.sig={};
  for(const p of PHASES)for(const h of HANDLERS[p])h.fn(S);
  S.week++;
  if(S.week>CAL.WEEKS){S.week=1;S.season++;logBook(S,'core','Season '+S.season+' begins.')}
  return S;
}
function run(S,weeks){for(let i=0;i<weeks;i++)tick(S);return S}
