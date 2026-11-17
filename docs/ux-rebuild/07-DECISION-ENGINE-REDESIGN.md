# Unified decision engine — technical and game design blueprint

## Problem: multiple legitimate APIs without a universal player contract

Current source decision endpoints include F.respond, F.answerBrief, F.decideProposal, F.talk, F.setMandate, F.pressAnswer, staff hiring/dismissal, department-specific controls and summer negotiations. desk.js routes between autonomous and escalated cases; ceocore.js tracks important choices/reviews. A rebuild must not erase specialization or create an unrelated second engine.

## Domain model: six distinct concepts

| Concept | Meaning | Player response |
|---|---|---|
| Event | Something happens independently in the world | Usually none |
| Case | A relevant issue with owner, deadline and record | Open and investigate |
| Conversation | Exchange where person, stance and history matter | Ask or express position |
| Decision | Authoritative CEO commitment where choices differ materially | One-tap commit |
| Agreement | Persisted mandate/strategy including owner, bounds, evidence and review | Negotiate / amend |
| Outcome | Real action, result or delayed consequence after execution | Read, assess, react |

**Never** merge a narrative event and a binding agreement into the same stored object only because both appear on Desk.

## Proposed canonical case contract

Illustrative schema, NOT current game state:

    case = {
      id: stableInstanceId,
      kind: "exception | policy | personnel | board | conflict | consultation | negotiation | review",
      origin: { engine: "events", eventKey: "wage_cap", sourceId: "..." },
      subject: { role: "dof", personId: "...", department: "recruit" },
      context: { season, week, actorSnapshot, relevantEvidenceIds: [] },
      authority: { owner: "ceo | staff | board", reason: "...", staffMandateRef: "..." },
      state: "noticed | open | investigating | committed | executing | evaluated | closed",
      priority: { severity: "normal | major | urgent", deadlineWeek: null, evidence: [] },
      recommendation: { actor, optionId, reasons: [] },
      options: [{ id, label, tradeoff, prerequisites, uncertainty, engineCommand }],
      unresolved: { policy: "staffActs | expires | deferred | boardEscalates", explanation: "..." },
      commitment: { by, optionId, committedAt, expectedCheckWeek },
      execution: { actor, state, logRefs: [] },
      result: { sourceId, actualEvents: [], evaluatedAt },
      revision: 0
    }

Case IDs should be stable across navigation and repeat renders, and **must not depend on inbox list position**. Use event instance identity and a serialized sequence. Separate stable event keys (types) from case instance IDs.

## Authority resolution

**Order of precedence** (proposed, confirm against current desk.js semantics):

1. The board and governance rules reserve explicitly constitutional/significant decisions.
2. The CEO's currently agreed mandate defines owner, money/identity thresholds, policy limits and escalation triggers.
3. Staff capability and situation-specific risk determine whether a legitimate exception needs CEO review.
4. Staff-led routine issues resolve autonomously within their mandate and produce a causal record where meaningful.
5. No-response handling is explicit: staff acts, expires, is deferred or escalates, never silently converts into a CEO choice.

Avoid treating Short leash/Normal/Free hand as merely a numerical reward slider. Show their operational meaning (which matters return to CEO, where staff independently decide, and the error exposure).

## Decision quality standard

Each consequential option must satisfy:

- Different action, stakeholder commitment, authority, resource path or timing.
- A credible trade-off that could make one choice preferable under some state.
- Conditional availability backed by actual state.
- No certainty where event randomness or employee discretion matters.
- An evaluable observable after a meaningful delay.
- No repeated same-week relationship farming through identical orders.

**Bad choice:** Approve (+2 trust), Agree enthusiastically (+3 trust), Reject (-2 trust).
**Good choice:** Authorize exception with wage ceiling; ask DoF to renegotiate and return before deadline; decline deal and prioritize future squad plan. Outcomes vary with need, finances, staff skill and negotiation state.

## Response interaction patterns

1. **Quick exception:** concise ask → recommendation/why → two or three distinct legal options → immediate saved commit → execution owner and follow-up.
2. **Short conversation:** topic → evidence from staff → optional follow-up question → expression of direction; changing a topic should not consume a fake action point.
3. **Agreement:** objective, authority boundary, resource commitment, responsible person, review checkpoint → one binding confirmation.
4. **Conflict:** reveal both actors' positions and incentives → CEO compromise/side choice/mediated agreement → both parties' subsequent autonomous actions.
5. **Personnel:** evidence, contract cost, candidate market, consequences → appointment/dismissal and vacancy plan.
6. **Board / public:** expectations, credibility and response, often public or multiweek; the CEO cannot simply reset stakeholder numbers.
7. **Consultation only:** no arbitrary ballot; close after reading, with optional request for more evidence.

Render from the same Case DTO with distinct templates keyed by case kind. Do not blindly force identical component markup.

## Real causal trace

Trigger → event instance → authority decision → response or autonomous action → follow-up → actual engine effect → ledger reference → outcome comparison.

Link existing ceocore decisions/delegated entries, storybook timeline, dossiers and pathway to one *view model*. No state duplication on day one. Store cross-references to original persistence IDs; do not copy outcome narratives into independent arrays.

An event can update cash, morale, relations, board confidence, offers, staff capability or sporting plan. A ledger may describe those effects, but should not invent them. Where a code effect cannot be causally attributed, record it as unverified.

## Integration and migration sequence

**Step D0 — Baseline:** build source registries and capture saves for founding, week 1, active conversation, pending event, summer, Matchday and season review.

**Step D1 — Normalized read model:** add adapters to read existing inbox messages, briefs, proposals, first-team talks, mandates and department actions into a common CaseView. No write behavior changes.

**Step D2 — Unified presentation:** replace separate mail/proposal/talk layouts with purpose-specific templates using the normalized CaseView. One screen-level pending request identity.

**Step D3 — Unified command gateway:** dispatch command by source and preserve authoritative F.respond / F.answerBrief / F.decideProposal / specialist functions. Add single-commit guard and idempotency based on case ID + revision, not button text.

**Step D4 — Agreement and outcome store:** persist only safe new fields behind version migration. Map existing ceocore, pathway, dossier and story IDs to cross-references; prevent duplicate post-week processing.

**Step D5 — Engine refactor (only after parity):** consolidate equivalent resolution rules, with staged migration and counterfactual seeded tests. Never rewrite all events at once.

**Step D6 — Retire old UI:** remove legacy duplicated message/sheet/ticker presentation only after every relevant action has a new route and a verified backwards-compatible equivalent.

## Testable invariants

- Exactly one committed result for one case/revision even on rapid double-click.
- Staff-owned case can be resolved without forcing a CEO approval.
- A declined offer cannot remain negotiable through an old target sheet.
- Two parties in conflict may react differently to one CEO direction.
- Authorizing a transaction cannot bypass finance/contract constraints through another UI route.
- Restart, save/load and time advance cannot replay resolved cases.
- Read-only info and a request for second opinion cannot secretly mutate approval state.
- Case deadlines use game-week time; the UI doesn't invent ticking real-time urgency.
- Old saves without a Case table still load through legacy adapters.
- A decision is never considered 'reviewed' solely because a message was archived.

## Event-by-event review still required

The 105 static keys in 02-DECISION-ENGINE-AUDIT.md need individually checked state predicates, option outcomes, staff-auto logic, disabled/auto flags and counterfactual seeds. Source registration alone is **not** evidence of design quality or reachability. Prioritize high-impact keys and rare multiweek narrative paths, then systematically complete the registry.
