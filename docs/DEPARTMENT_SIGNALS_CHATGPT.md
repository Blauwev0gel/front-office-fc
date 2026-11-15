# Department signals — implementation notes (chatgpt branch)

## Current scope
Scorecard rows are evidence, not a list of tasks. The `SIGNALS` mapping in `src/depts.js` identifies supported concerns and explains why they matter. The department overview and detail use the same `status()` result.

A CEO can schedule a three-week review or explicitly carry a risk for five weeks. Decisions are saved in `G.deptIssues`, using safe defaults for old saves. A later assessment checks the original scorecard trigger again. This does not manipulate performance or guarantee a green result.

## Known limitations / release blockers
- Scheduling a review is **not** a new operational plan executed by a head. Existing talk, mandate, hiring, budget and departmental action screens are the only operational levers.
- No automatic inbox reminder or weekly Gazette follow-up is yet wired.
- Academy has no supported warning definition: its scorecard does not establish a failing academy pathway.
- Finance signals are grouped only for overlapping last-week loss / runway. More robust cause-level grouping is still needed.
- Evidence of improvement is not proof of causation. A resolved item can be shown even if it improved for unrelated reasons.
- No complete integration test, save migration regression test, mobile/light/dark screenshot review or deployment verification has been performed for these changes.

## Acceptance checks before release
1. New game weeks 1–4: do not label unproven outcomes as failures.
2. Check all six department cards against the detail screen; vacancies in support staff do not count as problems.
3. Review/accept decisions survive save and reload, then advance three/five weeks and inspect due states.
4. Confirm the action links invoke actual existing mechanisms and do not promise a direct fix.
5. Recheck Finance runway and wage-cap interactions, and test concerns that disappear and recur.
6. Build, run Node tests, inspect 390 px and desktop screenshots in both themes, and verify GitHub Pages deployment.

## Design principle
A departmental concern is a governance conversation, not a mandatory checklist. The CEO manages people, priorities and trade-offs; departments execute their own work.
