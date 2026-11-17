# Implementation progress — 2026-11-17 · chatgpt

This is **completed code** on the chatgpt branch, not just an architecture proposal. The complete 47-task rebuild remains **IN PROGRESS**; do not mark screens, phases or departments as finished unless individually integrated.

## Delivered in this development session

| Scope | Implemented | Source |
|---|---|---|
| Inbox events | Atomic choice execution: validation, snapshot, rollback after thrown effect, commit only after success | `src/engine/09-meetings-actions-press.js` |
| Staff briefings | Invalid option guards; thrown option effects return error without setting done/choice/out | `src/engine/11-staffwork-analysis-briefs.js` |
| Autonomous staff events | Failed effect cannot create fake completed Gazette event or apply event cooldown | `src/engine/08-weekly-inbox.js` |
| Delegated decisions | No delegated ledger/reward/penalty when underlying effect fails | `src/desk.js` |
| Board projects | Second opinions, revisions, approval and decline retain distinct behavior; mutation rolls back on thrown effect, finance cap checked in engine | `src/engine/09-meetings-actions-press.js` |
| Decision model | Read-only, common `F.caseView(kind,id)` for event, briefing and project proposal. Existing authoritative source IDs and save format preserved | `src/engine/11-staffwork-analysis-briefs.js`, `src/engine/14-save-api.js` |
| Response UI | Consultation vs binding decision; shows source owner and no-response rule without using generic final-email phrasing | `src/ui/13-redbox-render.js`, `src/style/zz-text-only.css` |
| Project UI | No retired action-point gating, no fake swipe instructions; owner, stakes and no-response context | `src/ui/05-pitches-squad-money.js` |
| Conversations | Six-head selection → focused one-to-one with actual performance, relationship, last-meeting context and differentiated choices; one response per open conversation | `src/ui/06-sheets-ticker.js`, `src/ui/15-actions.js` |
| Regressions | Repeatable rollbacks, one-time commits, case model types, proposal finance limits and invalid tone checks added to ChatGPT CI workflow | `test/decision-integrity.js`, `.github/workflows/pages.yml` |

## Additional screen implementation delivered

- **Founding mandates and six-head mandate sheets:** replace slider-first interface with working-direction choices, actual staff fit and optional advanced policy controls. Previous mandates and engine behavior remain authoritative. Source: `src/ui/02-setup.js`, `src/ui/06-sheets-ticker.js`, `src/style/zz-text-only.css`.
- **Six department overview screens:** every department now explicitly describes its separate responsibility and renders real head/staff positions, concerns and projects before its existing specialist workflows. Source: `src/ui/08-departments.js`, `src/style/zz-text-only.css`.
- **One-to-one conversation UX:** focused mobile layout, performance context, selected person and tone trade-offs, one committed response per opened conversation. Does not yet implement durable negotiated multiweek agreements.
- **Project decisions:** engine-enforced Finance reserve limits, ability to ask for second opinion without legacy action point, clear difference between revision and final approval. CaseView includes proposal information.
- **CI:** `test/decision-integrity.js` is a ChatGPT branch publishing gate; exact most recent workflow status must be checked separately rather than assumed from earlier green runs.

## Integrated accountability chain — delivered in code (following session)

**Scenario implemented across all seven senior roles spanning six departments:** staff appointment or existing mandate → CEO mandate/working direction → durable agreement with responsible employee and six-game-week checkpoint → existing autonomous departmental execution → evidence from real F.record(role) scorecard → game-week review with source metrics → CEO renews, acknowledges or revises the mandate → outcome retained in the save and accessible from People and Desk.

- `G.agreements` is a JSON-save-compatible log keyed by stable ID, role, employee name, mandate snapshot, baseline evidence, due week, measured result, review decision and closure.
- `F.agreementWeekly()` is integrated into the authoritative `F.endWeek()` after staff and scorecard updates. A review is never created merely because a page was opened.
- Mandate changes supersede an outstanding agreement without deleting history. Appointments start an agreement; a head leaving closes an agreement; season turnover closes old evidence and uses a new scorecard baseline. Old saves initialize the store when needed.
- `G.conversations` stores actual selected talk, week, employee, real changes in relationship and motivation, and the linked agreement ID. `F.conversationView()` exposes the history.
- `F.caseView('a', id)` and `F.caseView('c', id)` expose read-only agreement and conversation dossiers alongside the existing events/briefs/proposals.
- People pages display current accountable head, agreed direction, baseline/current score, six-week review evidence and one-tap renew/acknowledge/revise routes. Desk shows reviews due and links to responsible departments. One-to-one meetings connect to the actual mandate editor.
- `test/decision-integrity.js` covers all seven appointed heads, a mandate change, automatic review, save/load, one-time renewal and conversation-to-agreement provenance.

**Important limit:** this establishes a functional accountability lifecycle for **mandate-based leadership**. It does not yet replace every specialized transfer, academy pathway, sponsor negotiation, marketing offer, board event or coaching conversation engine, nor does it prove all 197 interface states visually complete. Those remain roadmap tasks.

## Completion boundary

- **No gameplay balancing or all-screen reimplementation is claimed.**
- Decision read adapters exist for inbox events, staff briefings and project proposals. Direct departmental actions, academy pathway, recruitment negotiations and summer conversations are not yet routed through the same case model.
- The ordinary tone-based employee conversation is **still the underlying `F.talk` engine**. Its page layout and duplicate response behavior improved, but a persistent two-way agreement and evaluation model has **not** yet been implemented.
- Full screen registry in `05-EVERY-SCREEN-SPECIFICATION.md` (197 design targets) and 47-task roadmap still contain substantial remaining work. Treat this as an integrated decision foundation milestone.
- The current output must have successful GitHub Actions build and publish before advertising the latest preview as live; manual browser UX review remains unperformed.

## Next integrated milestone

1. Normalize actual departmental cases, finance/transfer exceptions, and important conversations without creating a parallel writer.
2. Design and code durable agreements and evidence-based review for all six heads.
3. Migrate remaining decision and detail screens to the case interaction system.
4. Replace legacy mandate and department templates while preserving game state and history.
5. Continue the remaining 47-task program through founding, all six departments, Matchday, season lifecycle and visual cleanup.

## Acceptance principles

- Do not mark a choice successful unless its effect actually commits.
- Do not remove a real game engine while replacing its UI.
- Do not turn consultation into compulsory CEO bureaucracy.
- Do not claim the full 47-task plan complete based on a green build alone.


## Fase 1 — specialist decision integration (2026-11-17, latest)

### Committed code

- `src/specialist-cases.js` is assembled after `ceocore.js` and before the UI through `build.py`. This supplies a **single transactional gateway** `F.specialistAct`, preserving the specialist engine that actually effects each decision, while guarding thrown errors and engine refusals.
- Migrated **23 direct UI action handlers** across `ui/15-actions.js`: recruitment focus/investment/approval/priorities/profiles/deadline decisions; academy pathways; Commercial offers/prices/experience/promotion; Marketing campaigns/community; Business budgets/proposals; coach conversations/support/dismissal; department issue plans, decisions and specialist appointments/departures.
- Existing `F.answerBrief` and `F.respond` now also produce the same specialist outcome record for legitimate department replies, including Academy youth actions, sponsor decisions, Finance briefings and recruitment exceptions. The original event/brief option remains the only authoritative side-effect writer.
- Every recorded specialist decision includes real source ID, week, department, accountable head, decision, **actual immediate state evidence**, observed execution status and a four-week evidence checkpoint. Repeated policy controls coalesce into one case per week rather than creating approval spam.
- `F.caseView('s', id)` makes specialist outcomes available in the shared read-only case model; `F.specialistCases` exposes current and prior cases. `F.specialistAcknowledge` closes a completed review once without erasing the history.
- People/Department pages display decision execution, real before/after source evidence, finance objections and acknowledgment. The Desk surfaces due evaluations and interdepartmental disputes. These are wired to actual engine records, not mock KPIs.
- **Commercial–Marketing:** community-identity clubs cannot authorize a betting sponsor through the old sponsor button or briefing without resolving the conflicting perspectives. CEO may approve, negotiate, or decline; original sponsor deal economics and fan reaction remain authoritative, while the relevant heads respond differently.
- **Finance–Recruitment/Marketing/Commercial:** when Finance reports spending outside its envelope, new scouting trips, campaigns or matchday investment require an explicit CEO exception or deferral. Rejected proposals spend nothing. Original cash limits and actual operational costs still apply after authorization.

### Validation

- `test/specialist-integration.js` exercises real recruitment/marketing/commercial/business/coaching paths, positive Academy development through its native briefing, specialist appointments/departures, prevention of duplicate sponsor approvals, transaction rollback, save/load, four-week review and one-time acknowledgment.
- Cross-department tests cover sponsor-vs-identity and Finance-vs-Scouting outcomes, including changed employee relationships and the inability of legacy sponsor briefings to bypass the restriction.
- Existing `test/decision-integrity.js` and other repository tests remain CI gates; GitHub Actions' most recent complete result must be checked before marking this release validated.

### What remains open

- This is a **substantial functional implementation of the requested Phase 1 specialist integration**, not a certificate that all 105 event/brief keys and 197 screen/state design targets were individually playtested.
- Some specialized engines still own their existing negotiations and conditional rules, intentionally: a generic case wrapper does **not** replace realistic transfer, Academy, finance or match logic. Further event-by-event semantic review and scripted browser journey coverage are necessary to establish literal completeness.
- Four-week reviews show **observed** changes, not claimed causal attribution for every cash/fan/football metric.
- Browser visual/touch QA has not been performed. A green build is not equivalent to a full mobile UI acceptance test.
