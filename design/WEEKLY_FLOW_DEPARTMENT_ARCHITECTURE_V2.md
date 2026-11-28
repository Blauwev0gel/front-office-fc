# Northmarch — The Living Organisation
## Weekly flow and department architecture V2
Status: design proposal for joint Claude/ChatGPT development, 28 November 2026. Baseline inspected: prototype/de-spelmaker.html, blob 255575dce3de9f9e7ba5de523229862d948ae993 (1563 lines). Refetch HEAD before implementation. Companion to Master Bible V2 and research 01–10; may supersede earlier design after agreement. No code or roadmap changes implied.

## 1. Current state and diagnosis
The updated prototype has typed inbox effects, forecast and feasibility, sponsor alternatives and dossiers, academy pipeline, expanded match simulation, in-house versus consultant research. These are useful foundations. However deptLoop still mostly uses thresholds and cooldowns; sponsorReview even presents delegated decisions as inbox choices with defaults. deptView emphasises assets, mandate, budget and research menu rather than objectives, work and results. Busy/free is binary. A.cnext resolves defaults, simulates match/window, calls deptLoop and weekTick, then presents next messages. New projects may tick immediately; define timing explicitly. The current compact league/calendar is not the final world. Published artifact parity and runtime behavior not independently verified.

## 2. Design objective
The chairman shapes an organisation rather than clicks through events. Club strategy → departmental objectives → operational plans → weekly execution → evidence and review → revised strategy. Each material action has an owner, cost, capacity, authority, outcome and causal history. No mandatory weekly chores or individual player decisions. Quiet weeks valid. Preserve four existing department tiles; do not create nine separate engines or screens merely because responsibilities are named.

## 3. Department operating model
Every department has philosophy, responsibilities, objectives, mandate, resources, routine operations, initiatives, performance and dependencies. The head asks: what is my remit, where are we, what blocks progress, what alternatives exist, do I need approval?
| Department | Routine operations | Strategic choices | Evidence |
|---|---|---|---|
| Football | training, matches, scouting, contracts, medical | squad age, promotion, player trading, coach philosophy | results, wages, availability, contract exposure |
| Academy | coaching, identification, development | local vs elite pathway, staffing, school network | intake, development, coaching load, first-team transition |
| Commercial | sponsor servicing, sales, matchday | local vs national partners, pricing, diversification | contracted income, renewal risk, demand, satisfaction |
| Finance | ledger, payments, forecast, budget monitoring | reserves, financing, savings, investment headroom | cash trough, commitments, variance, debt |
Finance advises and checks hard constraints; it does not veto every risk. Chairman can accept soft reserve risks explicitly, not spend nonexistent cash or bypass required consent.

## 4. Strategy and planning
Club objectives persist across weeks and have measurable outcomes, horizon, priority and owner. Example: sustainable academy, reduce sponsor dependency, promotion challenge. Heads translate objectives into plans with milestones and alternatives, including defer. Review on material changes and scheduled checkpoints, not regenerate every week. Philosophy influences preference; competence influences estimates and execution; ambition influences proposals. No guaranteed success. A plan can fail, pause, be replaced or finish. Preserve history.
Minimal state (illustrative): objective {id,metric,target,horizon,priority,owner}; plan {id,objectiveIds,department,owner,status,alternatives,workIds,dependencies,nextReview}; work {id,kind,owner,capacity,cost,authority,commitments,start,due,status}; result {id,workId,actual,evidence,eventIds}. Reuse existing dossiers, projects, commands and finance rather than duplicate them. Dossiers are evidence/history, not a second authoritative plan store.

## 5. Autonomy and capacity
Authority levels: routine (no message); delegated (execute and report); consultation (time-limited opportunity to intervene); approval (explicit decision or documented safe default); board (chair initiates/decides); member consent (required vote). Mandate includes contract duration, spending, policy and strategic scope. Routine sponsor renewal within agreed limits should execute without a fake approval. Revalidate feasibility at execution; defaults cannot bypass authority. Hard constraints vs soft risk must be explicit.
Replace busy/free with abstract capacity: routine workload consumes baseline units, initiatives reserve remaining units over time, shared roles cannot be double-booked. Do not expose timesheets. In-house research consumes capacity; consultants consume cash and some oversight. Hire, outsource, reprioritise or defer. Capacity numbers are synthetic until calibrated.

## 6. Cross-department coordination
Football × Academy: pathway and minutes policy; Football × Finance: wages and transfer commitments; Football × Commercial: sporting performance and demand; Academy × Commercial: schools and local sponsors; Academy × Finance: long-term investment; Commercial × Finance: contracts and forecast. Shared initiative has one accountable owner, contributors, dependencies and joint review. Competing plans use same cash/capacity reservation; unresolved strategic conflict escalates once with alternatives, not repeated messages.
Example: Academy wants schools expansion; coaching is saturated; Football needs experienced players; Finance forecasts cash trough; Commercial identifies local academy sponsor. Heads compare delay, coaching support, sponsor-funded expansion and reduced recruitment. Chairman chooses priority, staff execute, outcomes affect youth progression, cash and member confidence. Failure is possible. No direct player selection.

## 7. Weekly flow
Three rhythms: weekly operations, monthly management review, seasonal strategy/budget/ALV. Reviews are natural checkpoints, not arbitrary limits on player action.
Start of week: briefing of changes since previous week, match, financial movement, material departmental outcomes, exceptions and next milestones.
Chairman's office: inspect, initiate objective, request meeting, commission research, adjust budget/mandate, review personnel, propose role, coordinate departments, explore investment, intervene in active plan, or do nothing. Availability depends on resources and stage, not action points.
Continue: resolve eligible defaults once; advance one defined time boundary; settle due obligations and simulate football/external events; observe common snapshot; review objectives and needs; compare alternatives; reserve shared resources; execute delegated work or escalate; progress eligible existing work; evaluate results; emit typed events; update briefing/inbox. Freeze exact ordering with tests: new work cannot consume elapsed time retroactively, no duplicate payments, no UI-driven time advancement. Transfer stops preserve meaningful exceptions.
Next week reflects actual changes, not random event quota. Monthly report compares target vs actual and recommends changes. Season review links promises to outcomes and ALV.

## 8. Interface
Retain retro mobile-first hub and department-local actions. Weekly briefing/newspaper shows match, attendance, cash movement and material club changes. Club tiles show objective, current priority, workload, exceptions, head and relationship. Chairman agenda shows persistent initiatives and next review. Inbox contains material exceptions/decisions and reports, deduplicated by dossier/event. These are logical views, not a requirement for extra tabs; prefer existing navigation and no redundant popups.
Department detail: head/philosophy; objectives with actual vs target; routine work and active initiatives; capacity and budget; head assessment derived from state; dependencies; actions to review strategy, meet, research, resources, mandate and personnel. Example Academy: 3/5 school partnerships, 2 prospects, coaching bottleneck; 50% routine, 25% partnerships, 15% assessment, 10% free (illustrative only). Recommendation: strengthen coaching before expansion. Do not fabricate progress percentages without underlying state.
Chairman actions remain available proactively; no requirement to wait for inbox. Continue always available subject to explicit safe defaults and material transfer stops.

## 9. Technical architecture
Logical responsibilities: strategy, department planning, routine operations, capacity, initiatives, coordination, performance, scheduler and communication. Implement as small modules/functions inside existing prototype initially, not nine independent state stores. One state, clock, ledger, feasibility gateway, typed command/event model and stable IDs. UI projects state; commands mutate via validation. Planner: observe → review objective → identify needs → compare options → check capacity/finance/authority → execute/escalate → measure → update. All departments use shared contract with domain-specific options. Preserve sponsorOptions/sponsorLoop as starting vertical slice; migrate deptAct/deptLoop gradually. Use existing forecast/feas, typed effects and dossiers, audit atomicity and save migration. No second engine.

## 10. Proposed P1.5 — The Living Organisation
1. Persist club objectives and chairman agenda.
2. Department operating model: responsibilities, routine work, plans, outcomes.
3. Shared capacity and real delegated decisions.
4. Cross-department initiative and conflict resolution.
5. Weekly briefing and scheduler around same state.
6. Validate gameplay before expanding features.
Implement smallest end-to-end slice first: Commercial + Finance sponsor renewal tied to club objective; then Academy + Football pathway with shared capacity and one cross-department tradeoff. Do not build all abstractions before playable proof. Reconcile with current roadmap and Claude's latest work before editing.

## 11. Acceptance
- Delegated routine decisions execute without approval; material exceptions escalate once.
- Chair initiates an objective without inbox; heads create different plans based on philosophy and constraints.
- Two departments cannot spend same cash or capacity; infeasible options fail safely.
- A quiet week advances in one click; reports reflect actual state changes.
- Research informs a plan; failure/defer produces plausible follow-up.
- Save/load mid-plan preserves commitments, decisions and history; no duplicate settlement.
- Human playtest can explain current priorities, available actions, tradeoffs and outcomes.
- Paired seeded runs for youth, commercial, community and ambitious strategies; after three seasons compare staffing, work, income, facilities, reputation, squad and opportunities. Distinct outcomes are a hypothesis to test, not guaranteed success or classes.
- Local lightweight tests; no heavy CI without permission. Record exact SHA and actual test results.

## 12. Open decisions and limitations
Exact capacity units, authority thresholds, review cadence, strategy metric targets, calendar migration and conflict resolution need joint design. P1.5 is proposed, not approved canon. Static code audit only; no artifact playtest, runtime tests or empirical calibration. No prototype or existing Bible changes made by this document. Claude should challenge design and reconcile current branch before implementation.
