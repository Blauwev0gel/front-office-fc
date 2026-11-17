# RETRO WIREFRAME V4 — ChatGPT preview only
Status: CSS/design candidate, 16 November 2026.

## Goal and visual contract

A small-screen, pure text / wireframe interface for The Front Office. Think late-90s sports management reports: monospace type, ink-on-paper panels, small green status accents, strong divider lines, dense but readable tables, and literal labels instead of symbolic art. **No simulated graphics are necessary to play.**

- **Scope:** \`chatgpt\` only. Keep \`main\` and \`claude-game\` untouched. Keep the existing FO modules, decisions, texts, flows, event UI actions and saves.
- **Source of truth:** \`src/style/zz-text-only.css\` is the final presentation override, replacing its previous contents (not stacking multiple retro CSS layers). Earlier unmodified \`src/style/*\` styles still support the layout; V4 overrides the visual vocabulary.
- **Palette:** paper \`#fcfcf9\`, field \`#e9ebe6\`, ink \`#18271f\`, restrained evergreen \`#284737\`. Success/error remain semantically different, not decoration.
- **Type:** system monospace; 14px default, readable headings, 11–12px only for labels, 44px tap minimum on buttons.
- **Shapes:** rectangular panels, 1px standard separators, 2px for primary framing, no gradients, shadows, portraits, SVG/canvas/video art or decorative animation.
- **Navigation:** six top-level text tabs remain horizontally scrollable; five fixed bottom actions remain visible with a large \`Next match\`/play control. The mobile layout allows safe-area padding and bottom content reserve.
- **Forms:** founding and hiring choices, summer agenda, scouting and finance forms stay actual form controls. The selected choice has high-contrast reverse coloring and visible border, not just an icon.
- **Inbox (B16 update):** each option directly commits with one tap. No selecting a draft, sending separately, action points, or additional confirmation. Feedback appears immediately and the save is updated. CEO Core and Club Story panels remain folded.
- **Departments:** one-column cards on phones, two-column department overview when spacious. Data tables retain their columns and overflow within their own scroll wrappers.
- **Summer:** participant names stay visible despite art stripping. Agenda / steps / letters and the transfer deadline ticker are text-led.
- **Matchday:** entirely separate screen (preview → running commentary → full time → Gazette), with readable score, event log, fast-forward/sim controls and bottom button tray. No stadium illustration is generated.

## Technical constraints and regression guard

\`src/ui/00-text-mode.js\` already replaces avatars, icons and office drawing with text and does not mutate game state; retain it. \`src/ui/14-matchday-gazette.js\` already omits the pitch and stadium art. The B16 follow-up replaces the old action-point gates and introduces immediate reply dispatch while preserving the original decision engines.

\`test/text-mode.js\` has static contracts for complete compiled JS, required actions, monospace system, square controls, responsive rules, selected states, retained summer participants and presence of all key retro screen selectors.

Optional browser QA script \`test/browser/text-mode.cjs\` exercises founding, phone+desktop overflow, six navigation tabs and match/Gazette. **Do not claim a complete browser test until it has actually been executed**. CI runs the static checks and engine tests; no browser-playtest is configured there.

## Release gate

1. Parse complete standalone JS, ensure all required action handlers remain.
2. Validate retro CSS braces/selector contract, before commit.
3. Run existing \`test/text-mode.js\`, \`test/ceocore.js\`, \`test/stories.js\` with \`python3 build.py\` on GitHub Actions.
4. Publish only after actual GitHub Actions build, artifact upload and Pages deploy succeed.
5. A mobile browser visual walk-through is still needed for final UI sign-off. That is not silently counted as passed.

**No claim is made that every 320px device has been interactively tested.** The CSS targets 350px, 500px and 680px breakpoints, including narrow phones.
