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
  if(FEATURE_PANELS[slot])throw new Error('Duplicate feature panel: '+slot);
  FEATURE_PANELS[slot]=render;
}
function featurePanel(slot){
  return FEATURE_PANELS[slot]?FEATURE_PANELS[slot]():'';
}
