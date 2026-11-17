# Decision Source Registry — current engine

**Source audit at `chatgpt` 2026-11-17.** Entries are IDs referenced in registration expressions, not guaranteed reachable at runtime. `from`/`dept` are parsed from local source and may be imprecise for expressions with nested function definitions; consult engine. The `opts` and `auto` columns are heuristics, not proof of a meaningful choice. Dynamic event prefixes must be audited by runtime generation.

| ID | Event/brief key | Family | Source | Owner hint | Department hint | Options in local source | Auto handler in local source |
|---|---|---|---|---|---|---|---|
| DEC-001 | `dof_rule` | event | `src/events.js` | dof | sporting | Yes | Yes |
| DEC-002 | `bid_star` | event | `src/events.js` | dof | sporting | Yes | Yes |
| DEC-003 | `raise_demand` | event | `src/events.js` | dof | sporting | Yes | Yes |
| DEC-004 | `coach_dof_clash` | event | `src/events.js` | coach | sporting | Yes | Yes |
| DEC-005 | `free_veteran` | event | `src/events.js` | dof | sporting | Yes | Yes |
| DEC-006 | `scout_gem` | event | `src/events.js` | scout | scouting | Yes | Yes |
| DEC-007 | `data_vs_eye` | event | `src/events.js` | scout | scouting | Yes | Yes |
| DEC-008 | `deadline_day` | event | `src/events.js` | dof | sporting | Yes | Yes |
| DEC-009 | `agent_fee` | event | `src/events.js` | dof | sporting | Yes | Yes |
| DEC-010 | `dressing_room` | event | `src/events.js` | coach | not declared | Yes | Yes |
| DEC-011 | `losing_streak` | event | `src/events.js` | board | not declared | Yes | Yes |
| DEC-012 | `coach_poached` | event | `src/events.js` | coach | not declared | Yes | Yes |
| DEC-013 | `injury_crisis` | event | `src/events.js` | coach | not declared | Yes | Yes |
| DEC-014 | `youth_debut` | event | `src/events.js` | acad | academy | Yes | Yes |
| DEC-015 | `training_complaint` | event | `src/events.js` | coach | not declared | Yes | Yes |
| DEC-016 | `style_drift` | event | `src/events.js` | coach | not declared | Yes | Yes |
| DEC-017 | `captain` | event | `src/events.js` | coach | not declared | Yes | Yes |
| DEC-018 | `wonderkid` | event | `src/events.js` | acad | academy | Yes | Yes |
| DEC-019 | `acad_facility` | event | `src/events.js` | acad | academy | Yes | Yes |
| DEC-020 | `parents` | event | `src/events.js` | acad | academy | Yes | Yes |
| DEC-021 | `school_partner` | event | `src/events.js` | acad | academy | Yes | Yes |
| DEC-022 | `youth_coach_leaving` | event | `src/events.js` | acad | academy | Yes | Yes |
| DEC-023 | `bet_sponsor` | event | `src/events.js` | com | commercial | Yes | Yes |
| DEC-024 | `naming_rights` | event | `src/events.js` | com | commercial | Yes | Yes |
| DEC-025 | `ticket_protest` | event | `src/events.js` | fans | commercial | Yes | Yes |
| DEC-026 | `local_deal` | event | `src/events.js` | com | commercial | Yes | Yes |
| DEC-027 | `crypto` | event | `src/events.js` | com | commercial | Yes | Yes |
| DEC-028 | `kit_deal` | event | `src/events.js` | com | commercial | Yes | Yes |
| DEC-029 | `hospitality` | event | `src/events.js` | com | commercial | Yes | Yes |
| DEC-030 | `tour` | event | `src/events.js` | com | commercial | Yes | Yes |
| DEC-031 | `sponsor_morals` | event | `src/events.js` | com | commercial | Yes | Yes |
| DEC-032 | `viral` | event | `src/events.js` | mkt | marketing | Yes | Yes |
| DEC-033 | `social_gaffe` | event | `src/events.js` | mkt | marketing | Yes | Yes |
| DEC-034 | `documentary` | event | `src/events.js` | mkt | marketing | Yes | Yes |
| DEC-035 | `rebrand` | event | `src/events.js` | mkt | marketing | Yes | Yes |
| DEC-036 | `community_day` | event | `src/events.js` | mkt | marketing | Yes | Yes |
| DEC-037 | `trust_seat` | event | `src/events.js` | fans | marketing | Yes | Yes |
| DEC-038 | `rival_banter` | event | `src/events.js` | mkt | marketing | Yes | Yes |
| DEC-039 | `press_interview` | event | `src/events.js` | press | marketing | Yes | Yes |
| DEC-040 | `tax_bill` | event | `src/events.js` | fin | business | Yes | Yes |
| DEC-041 | `investor` | event | `src/events.js` | board | business | Yes | Yes |
| DEC-042 | `stadium_expansion` | event | `src/events.js` | fin | business | Yes | Yes |
| DEC-043 | `pitch` | event | `src/events.js` | fin | business | Yes | Yes |
| DEC-044 | `wage_cap` | event | `src/events.js` | fin | business | Yes | Yes |
| DEC-045 | `council_land` | event | `src/events.js` | fin | business | Yes | Yes |
| DEC-046 | `energy` | event | `src/events.js` | fin | business | Yes | Yes |
| DEC-047 | `loan_offer` | event | `src/events.js` | fin | business | Yes | Yes |
| DEC-048 | `cash_crisis` | event | `src/events.js` | fin | business | Yes | Yes |
| DEC-049 | `staff_raise` | event | `src/events.js` | board | business | Yes | Yes |
| DEC-050 | `staff_leak` | event | `src/events.js` | press | marketing | Yes | Yes |
| DEC-051 | `staff_quit` | event | `src/events.js` | board | business | Yes | Yes |
| DEC-052 | `staff_poach` | event | `src/events.js` | board | business | Yes | Yes |
| DEC-053 | `com_mkt_clash` | event | `src/events.js` | com | commercial | Yes | Yes |
| DEC-054 | `board_pet` | event | `src/events.js` | board | sporting | Yes | Yes |
| DEC-055 | `fan_protest` | event | `src/events.js` | fans | marketing | Yes | Yes |
| DEC-056 | `board_warning` | event | `src/events.js` | board | business | Yes | Yes |
| DEC-057 | `derby` | event | `src/events.js` | mkt | marketing | Yes | Yes |
| DEC-058 | `merger_grudge` | event | `src/events.js` | fans | marketing | Yes | Yes |
| DEC-059 | `player_unsettled` | event | `src/events.js` | coach | not declared | Yes | Yes |
| DEC-060 | `owner_doubts` | event | `src/events.js` | board | business | Yes | Yes |
| DEC-061 | `coach_staff_request` | event | `src/events.js` | coach | not declared | Yes | Yes |
| DEC-062 | `loan_youngster` | event | `src/events.js` | dof | sporting | Yes | Yes |
| DEC-063 | `exception_review` | event | `src/events.js` | dof | sporting | Yes | Yes |
| DEC-064 | `coach_authority` | event | `src/events.js` | coach | not declared | Yes | Yes |
| DEC-065 | `transfer_request` | event | `src/events.js` | dof | sporting | Yes | Yes |
| DEC-066 | `agent_scandal` | event | `src/events.js` | press | sporting | Yes | Yes |
| DEC-067 | `crypto_collapse` | event | `src/events.js` | press | commercial | Yes | Yes |
| DEC-068 | `fan_boycott` | event | `src/events.js` | fans | commercial | Yes | Yes |
| DEC-069 | `doc_episode` | event | `src/events.js` | mkt | marketing | Yes | Yes |
| DEC-070 | `player_ego` | event | `src/events.js` | coach | not declared | Yes | Yes |
| DEC-071 | `nephew` | event | `src/events.js` | board | sporting | Yes | Yes |
| DEC-072 | `investor_demands` | event | `src/events.js` | board | business | Yes | Yes |
| DEC-073 | `loan_minutes` | event | `src/events.js` | dof | sporting | Yes | Yes |
| DEC-074 | `star_unrest` | event | `src/events2.js` | dof | sporting | Yes | Yes |
| DEC-075 | `sponsor_renewal` | event | `src/events2.js` | com | commercial | Yes | Yes |
| DEC-076 | `stand_objection` | event | `src/events2.js` | fin | business | Yes | Yes |
| DEC-077 | `stand_delay` | event | `src/events2.js` | fin | business | Yes | Yes |
| DEC-078 | `behind_target` | event | `src/events2.js` | board | business | Yes | Yes |
| DEC-079 | `scout_find` | brief | `src/briefs.js` | dynamic/not local | not declared | Yes | Not found |
| DEC-080 | `scout_dry` | brief | `src/briefs.js` | dynamic/not local | not declared | Yes | Not found |
| DEC-081 | `dof_priority` | brief | `src/briefs.js` | dynamic/not local | not declared | Yes | Not found |
| DEC-082 | `unhappy_player` | brief | `src/briefs.js` | dynamic/not local | not declared | Yes | Not found |
| DEC-083 | `form_player` | brief | `src/briefs.js` | dynamic/not local | not declared | Yes | Not found |
| DEC-084 | `coach_slump` | brief | `src/briefs.js` | dynamic/not local | not declared | Yes | Not found |
| DEC-085 | `coach_flying` | brief | `src/briefs.js` | dynamic/not local | not declared | Yes | Not found |
| DEC-086 | `injury_blow` | brief | `src/briefs.js` | dynamic/not local | not declared | Yes | Not found |
| DEC-087 | `acad_flying` | brief | `src/briefs.js` | dynamic/not local | not declared | Yes | Not found |
| DEC-088 | `acad_intake_soon` | brief | `src/briefs.js` | dynamic/not local | not declared | Yes | Not found |
| DEC-089 | `fin_wage` | brief | `src/briefs.js` | dynamic/not local | not declared | Yes | Not found |
| DEC-090 | `fin_runway` | brief | `src/briefs.js` | dynamic/not local | not declared | Yes | Not found |
| DEC-091 | `crowd_low` | brief | `src/briefs.js` | dynamic/not local | not declared | Yes | Not found |
| DEC-092 | `sellout` | brief | `src/briefs.js` | dynamic/not local | not declared | Yes | Not found |
| DEC-093 | `mood_drop` | brief | `src/briefs.js` | dynamic/not local | not declared | Yes | Not found |
| DEC-094 | `project_check` | brief | `src/briefs.js` | dynamic/not local | not declared | Yes | Not found |
| DEC-095 | `coach_debrief` | brief | `src/briefs.js` | dynamic/not local | not declared | Yes | Not found |
| DEC-096 | `big_game` | brief | `src/briefs.js` | dynamic/not local | not declared | Yes | Not found |
| DEC-097 | `staff_distant` | brief | `src/briefs.js` | dynamic/not local | not declared | Yes | Not found |
| DEC-098 | `chairman_call` | brief | `src/briefs.js` | dynamic/not local | not declared | Yes | Not found |
| DEC-099 | `block_` | brief | `src/season.js` | dynamic/not local | not declared | Not found | Not found |
| DEC-100 | `stake_match` | brief | `src/season.js` | board | board | Yes | Not found |
| DEC-101 | `winter_deadline` | brief | `src/season.js` | dynamic/not local | not declared | Yes | Not found |
| DEC-102 | `signing_review` | brief | `src/season.js` | dynamic/not local | not declared | Yes | Not found |
| DEC-103 | `story_` | story | `src/stories.js` | dynamic/not local | not declared | Not found | Yes |
| DEC-104 | `story_` | story | `src/stories.js` | dynamic/not local | not declared | Not found | Yes |
| DEC-105 | `dos_` | dossier | `src/dossiers.js` | dynamic/not local | board | Yes | Yes |

## Decision and action source families not expressible as static event IDs

| Family | Authoritative code | UI renderer / action | Classification and redesign requirement |
|---|---|---|---|
| Inbox messages | `engine/08-weekly-inbox.js`, `engine/09-meetings-actions-press.js`, `desk.js` | `ui/13-redbox-render.js` `msgHtml`, `mailSend`; `mchoose`, `second` | Mandatory vs delegated vs informational; single owner and no-response semantics |
| Briefings | `engine/11-staffwork-analysis-briefs.js`, `briefs.js` | `briefHtml`, `brief`, `mchoose` | Advice, optional consultation and substantive response must be distinct |
| Board proposals / projects | `engine/09-meetings-actions-press.js`, `events2.js` | `pitchDeck`, `propHtml`, `prop` | Cost, uncertainty, expiry, board approval, responsible head and subsequent work |
| Mandates / authority | `engine/04-staff-dna.js`, `desk.js` | `mand-save`, `auth`, `mand-done` | Agreement with employee; scope, resources, review and autonomy |
| Staff conversation / dismissal | `firstteam.js`, `engine/09-meetings-actions-press.js` | `talk-do`, `ft-ans`, `fire`, `ft-sack` | Contextual two-sided conversation; distinct from decision ballot |
| Transfer and squad planning | `recruit.js`, `recruitx.js`, `summer.js`, `summer2.js` | `rec-appr`, `rx-focus`, `squad-plan-ask`, `dd-dec` | Exception/negotiation/seasonal planning separation |
| Academy development | `academy.js`, `academy2.js`, `academy3.js`, `pathway.js` | `ag`, `pw-ask`, `pw-change`, `ysack` | Longitudinal agreement and measurable evidence |
| Department-specific work | `depts.js`, `commercial.js`, `marketing.js`, `business.js` | `dept-plan`, `com-offer`, `mk-camp`, `biz-prop` | Action stays employee-owned unless over mandate or governance override |
| Press and reputation | `engine/09-meetings-actions-press.js`, `loop.js` | `press`, `press-next` | Contextual public narrative, not artificial dismissal meter |
| Club storylines | `stories.js`, `dossiers.js`, `pathway.js` | inbox messages, dossier/pathway views | One narrative thread spanning generated event, decision, action and consequence |

## Core audit findings / hypotheses to validate during redesign

1. Several event registration surfaces and response renderers coexist. **Fact:** `respond`, `answerBrief`, `decideProposal`, `talk`, `setMandate`, department action functions use distinct APIs. **Risk:** the player receives inconsistent action vocabulary; consequence ownership can be fragmented.
2. `desk.js` has `Short leash`, `Normal`, and `Free hand` authority modes. **Design question:** whether the trade-off is transparent without reducing delegation to an arbitrary risk dial.
3. `ceocore.js` is described by its header as an evidence ledger, not a second engine. Keep that distinction until the unified schema has a tested migration.
4. `events2.js` marks some legacy events automatic or disabled. Their source definitions must not automatically be presented as currently player-facing decisions; runtime reachability is unverified.
5. Many registered events are context-specific; not all need identical choice counts or consequences. Evaluate actual options and outcome code per ID before migrating.

## Specific findings from reading the resolution functions (not just registration names)

1. **Silent briefing failures are disguised as successful responses.** In engine/11-staffwork-analysis-briefs.js, answerBrief wraps option.f in a try/catch, replaces a thrown error with “Noted.”, and still sets b.done=true with the chosen index. This can erase evidence of a failed decision and must be treated as a correctness defect, not a copywriting problem. Proposed fix: distinguish validated success, recoverable failure, and save-state conflict; only close after a successful authoritative effect.
2. **Board proposals implement substantively different command kinds.** decideProposal supports second opinions, revise, reject and approve. Revising mutates the proposal terms (cost, weekly commitment and estimated chance), approving immediately charges cash and creates an owned project, rejecting applies cooldown and relationship reaction. A three-option generic ballot would erase those distinctions; model the revision as negotiation and approval as a binding commitment.
3. **Staff conversations directly modify relations/boosts.** talk(role,tone) applies context- and personality-dependent effects for review, praise, challenge, reassure and warn, with a cooldown dampening repetition. However it is still mainly a tone-selection API, not a lasting mutually agreed objective. Preserve existing effects while adding a genuine agreement layer where warranted.
4. **Mandates are mutated directly.** setMandate immediately replaces G.mand[role] and changes staff relationship based on magnitude and alignment; it has an unchanged-mandate guard. There is no general saved owner/objective/evidence/checkpoint object in that function. Avoid describing current mandates as completed negotiated agreements.
5. **Randomized escalation exists even at fixed authority level.** desk.js reason() can escalate because Short leash triggers a 55% conditional check, cold relationships can trigger a 40% conditional check, and weak capability can trigger another probability. These may produce convincing interpersonal variability, but the reason shown to the player must be clear; don't claim every escalation is determined by a hard rule.
6. **Autonomous work may be visible only in the newspaper.** engine/08-weekly-inbox.js autoEvent applies the selected event effect and appends a Gazette story marked auto=1; desk.js has aggregated deskView counts. Source-level evidence does not prove all actions are linked to durable, individually explorable case histories. Correlation and traceability deserve design work.
7. **Inbox pacing already has protection.** genMessages explicitly allows quiet weeks and sets optional new event slots to zero in the first week and at most one in weeks 2–3 of season one; forced events still apply. Do not prescribe rebuilding first-week pacing from scratch without measuring remaining forced events or briefings.
8. **Idempotency exists in some paths but not as one shared contract.** respond returns null for m.done, decideProposal rejects non-open status, and setMandate checks identical changes. Preserve these checks while adding uniform frontend double-tap and case revision protection.

These findings adjust the redesign priorities: fix silent failure propagation early; separate consultation, negotiation, approval and commitment; then introduce an outcome ledger that does not duplicate the authoritative effect.
