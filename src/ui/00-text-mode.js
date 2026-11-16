/* The Front Office · text-first presentation.
   Keep the real engine, screens, and data-a action handlers. Replace only
   decoration; never change game state, seed, saves, or decision outcomes. */
(function () {
  // UI save-key tests intentionally load this prefix without the faces module.
  if (typeof ART === 'undefined') return;
  const noVisual = () => '';
  // Names, statistics, and choice labels are already rendered by the views.
  // Returning no avatar avoids generating thousands of SVG shapes.
  ART.face = noVisual;
  ART.staffFace = noVisual;
  ART.playerFace = noVisual;
  ART.poolFace = noVisual;
  ART.office = o => '<p class="text-office">League position: ' + String(o.pos || '–') +
    ' · Target: ' + String(o.target || '–') +
    ' · Outstanding decisions: ' + String(o.needs || 0) + '</p>';

  // Icons never carry essential data. Buttons with only an icon get readable
  // text via their aria-label in the plain CSS.
  Object.keys(ART.I).forEach(k => { ART.I[k] = ''; });

  // No sound/animation/vibration in the engine-testing presentation.
  ART.vib = noVisual;
  for (const k of Object.keys(ART.SND)) ART.SND[k] = k === 'on' ? (() => false) : noVisual;
})();
