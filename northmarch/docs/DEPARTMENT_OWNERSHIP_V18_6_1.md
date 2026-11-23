# Northmarch V18.6.1 — One owner per action

## UX rule
Every investment and operational decision has one natural owner in the club's existing department tiles. Do **not** add another global upgrade dashboard or a parallel action system. A tile is an entry to a department sheet, not a decorative link to a second menu. Keep the weekly match, full-time and Echo newspaper loop unchanged.

## Assignment
| Home tile | Owning screen | Investments and controls |
|---|---|---|
| Training | Training department | Training ground, staff, budget, focus, results |
| Medical | Medical department | Medical centre, staff, budget, focus, injury results |
| Youth | Academy department | Academy building, staff, budget, intake records |
| Scouting | Scouting department | Scouting office, recruitment pipeline, staff, budget |
| Commercial | Commercial department | Club shop, events, staff and commercial results |
| Community | Community department | Clubhouse, membership team and dues |
| Matchday | Matchday department | Car park, staff, matchday operating approach |
| Stadium | Ground overlay | Stands, pitch, turnstiles, safety, catering, upkeep, grounds staff |
| Finances | Money view | Financial cash panel, operating result, ledger, debt, forecast |

Other existing tiles such as Squad, Manager, Board and League retain their respective ownership.

## Removed
- The global V18.6 upgrades grid
- The redundant `Invest in your club` / `Explore upgrades` home CTA
- The second `Open full department report` detour in department sheets

## Preserved
- Existing `StartProject` engine via `gbuild` command for all building decisions
- Project cost, delays, permits, construction payments and upkeep
- Budget/department/staff commands, save schema and current game data
- Match result, Echo weekly newspaper and seasonal gameplay
- Compatibility redirect for older `tab=build` links into Stadium > Investments

## Mobile defect
The V18.6 home CTA used a flex row with a nonshrinking Upgrades button, squeezing text into a one-character-wide span. Removed that row; homepage uses a responsive two-column grid below 430px with safe word-breaking rules. This is a structural correction, not merely hiding the broken text.

## Verification
- Compiled complete 43-module V18.6.1 JavaScript
- Confirmed 13 department/club tiles, including Medical, Community and Matchday
- Confirmed facility investment and staffing on first department screen (no full report detour)
- Tested successful real project approval, construction start, payment and status for Training, Medical, Academy, Scouting, Commercial, Community and Matchday
- Tested Stadium project action (turnstiles), stadium project filter (no department plot duplication), and grounds staffing controls
- Tested finances view, full-time -> Echo -> club loop, and V18.4 save loading + re-saving
- Regression test `northmarch/test/department-ownership.js` is local-only; no extra Actions runs
- Mobile visual browser QA remains desirable; the screenshot bug was reproduced through code analysis and removed by eliminating the offending markup

Release: V18.6.1 UI/navigation correction. No change to financial or football simulation formulas.
