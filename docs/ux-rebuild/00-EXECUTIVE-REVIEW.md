# Executive review — The Front Office whole-game audit

**Audit scope:** The chatgpt branch, source snapshot started at commit 6b70e7057 on 2026-11-17. Inspected numbered UI and engine fragments and feature modules for departments, the Desk, decision events, coaching, recruitment, academy, commercial, marketing, business, summer, seasons, Matchday, pathways and dossiers. The beginning of BIBLE.md is historically main-branch-derived; use it as design intent, not proof about today's chatgpt runtime.

## Decision: rebuild the player's operating model, not just presentation

The CEO fantasy requires alignment between **who has authority**, **how a player expresses direction** and **how the game shows what staff did**. Cards and menu redesigns alone cannot fix contradictions between those layers.

## Source-backed findings

1. **UI fragmentation.** src/ui/15-actions.js has 125 named cases. Separate UI modules render onboarding, summer/preseason/press, navigation, squad/recruitment, sheets/ticker, Club/League, departments, coach/academy/review, Desk, profiles, conversations, mail and Matchday. This is not a four-page app.
2. **Decision fragmentation.** engine/09-meetings-actions-press.js exposes respond, decideProposal, talk, setMandate, fire and pressAnswer; engine/11-staffwork-analysis-briefs.js has answerBrief; specialist modules add their own interactions. Legitimately different mechanisms lack one consistent player-facing decision contract.
3. **Delegation is real.** desk.js defines Short leash, Normal and Free hand and distinguishes CEO-reserved events from staff-resolvable cases. Retain this authority mechanic and expose its trade-offs rather than converting each action into an approval chore.
4. **Six departments exist.** depts.js implements First Team, Recruitment (DoF/Chief Scout), Academy, Commercial, Marketing and Business, each with heads, specialist staff, finance and measures.
5. **Causal records have overlapping presentation purposes.** ceocore.js is an evidence ledger; dossiers.js, stories.js and pathway.js supply multi-week cases. Connect them through shared UI identity while preserving independent persistent sources until migration is proven safe.
6. **Matchday has historical parallel UI.** ui/14-matchday-gazette.js is the staged Matchday; ui/06-sheets-ticker.js still has a ticker path. Verify reachability before retiring older controls.
7. **Saves matter.** engine/14-save-api.js stores G as JSON and migrates older versions, removing legacy action points. A unified decision model must migrate state and avoid duplicate commits.

## Specific defects and already-existing protections

- **Concrete correctness issue:** answerBrief() catches exceptions from selected option effects, substitutes “Noted.”, and marks the briefing done anyway. A failed action can therefore appear successfully answered. Fix failure propagation and atomic commit behavior in the first decision-engine milestone.
- **Over-generalized response design:** decideProposal() already distinguishes asking for a second opinion, revising terms, declining and approving a funded project. That workflow should not be flattened to a single generic choice component.
- **Mandate agreement gap:** setMandate() updates the stored mandate and relationship immediately; it does not itself create an objective, evidence checkpoint or written two-party agreement. Those additions require actual new system design.
- **Existing pacing protection:** genMessages() deliberately allows quiet weeks and limits optional event slots in the first three weeks. Diagnose any remaining week-one overload from forced events, briefs or other sources before removing the pacing system.
- **Existing staff autonomy:** autoEvent() resolves staff-owned events and writes a Gazette item. What is missing is consistent long-lived causal access rather than a basic ability for departments to act.

## Risks still requiring evidence

- Number of response choices does not establish decision quality; actual option/outcome code needs a counterfactual review.
- Different departmental workflows cannot automatically become identical three-button ballots.
- Some legacy event keys are forced to auto/off in events2.js; source-registered keys are not automatically live CEO decisions.
- The four-destination navigation must still be challenged against actual route depth and context switching.
- Features mentioned in design prose but not backed by current renderer functions must be classified proposed, not existing.
- No browser-based visual QA has been carried out in this audit; reachability and readability remain unverified.

## Target operating model

**One accountable case lifecycle:** trigger → classify/authority → evidence → conversation/CEO decision when relevant → employee execution → outcome → evidence review → history. Staff-led work bypasses compulsory CEO approval but remains visible through meaningful updates.

**One coherent interface:** phase-based primary journey with stable navigation to Football, Club and People. A decision interaction provides owner, context, evidence, recommendation, distinct options, a no-response path, uncertainty and a one-tap commit.

**A living club:** match weeks, relationships, departmental projects, objectives and results drive rhythm; administrative notifications do not create artificial workload.

## Deliverable status

This is a source-grounded audit and redesign plan, **not** a completed rebuild or proof of browser/runtime coverage. Associated registers include 166 named UI function entries, 125 dispatcher cases, 105 statically registered event/brief keys, and 197 individual proposed screen/state design targets. Those are different unit types. Coverage limits and follow-up validation appear in 09-COVERAGE-AND-TRACEABILITY.md.

## Implementation recommendation

Create a shared decision contract and navigation shell first, then deliver all six departments, football/Matchday, season lifecycle and cleanup in integrated increments. Every code change must link back to Screen, Action and Decision IDs.
