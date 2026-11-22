/* Optional feature boundaries.
   Core emits factual lifecycle events and offers named view slots; higher layers register
   themselves here. No feature name, employee persona or narrative concept belongs in core.
   Missing features are supported: the base game continues unchanged. */
const FEATURE_HOOKS=Object.create(null),FEATURE_PANELS=Object.create(null);
function onFeature(event,fn){
  if(typeof fn!=='function')throw new TypeError('Feature hook must be a function');
  (FEATURE_HOOKS[event]||(FEATURE_HOOKS[event]=[])).push(fn);
}
function fireFeatureEvent(event,data){
  for(const fn of FEATURE_HOOKS[event]||[])fn(data);
}
function registerFeaturePanel(slot,render){
  if(typeof render!=='function')throw new TypeError('Feature panel must be a function');
  (FEATURE_PANELS[slot]||(FEATURE_PANELS[slot]=[])).push(render);
}
function featurePanel(slot){
  return (FEATURE_PANELS[slot]||[]).map(fn=>fn()).join('');
}

/* Optional rules and UI commands: fallback values belong to the base game. */
const FEATURE_RULES=Object.create(null),FEATURE_ACTIONS=Object.create(null);
function registerFeatureRule(name,fn){
  if(typeof fn!=='function'||FEATURE_RULES[name])throw new Error('Invalid or duplicate feature rule: '+name);
  FEATURE_RULES[name]=fn;
}
function featureRule(name,arg,fallback){return FEATURE_RULES[name]?FEATURE_RULES[name](arg):fallback}
function registerFeatureAction(name,fn){
  if(typeof fn!=='function'||FEATURE_ACTIONS[name])throw new Error('Invalid or duplicate feature action: '+name);
  FEATURE_ACTIONS[name]=fn;
}
function featureAction(name,arg){if(!FEATURE_ACTIONS[name])return false;FEATURE_ACTIONS[name](arg);return true}
