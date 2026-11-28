# Club Founders V0.1 — design and handover
28 November 2026. Standalone experiment, not a replacement for De Spelmaker or Slimline. Open club-founders.html locally in a browser.

## Confirmed player requirements
- Found a new club from scratch, starting in the lowest division. Members own the club; player is founding elected chairman, not private owner or football manager.
- Flexible time model: free access to information, meaningful constraints on major initiatives. No compulsory weekly trivial decisions.
- Founding modifiers, advantages and disadvantages; choices form persistent club DNA. Department-specific DNA matters more than generic permanent mandates.
- Hire staff per department; they run operations autonomously. Treat club as a business. Make meetings, information, interventions and research enjoyable.
- Finance and facilities require deep development. All department information and upgrades belong within the department tile.
- Inbox must emerge from actual club circumstances. Player can initiate interesting chairman-level actions even during quiet weeks. Action -> consequence.
- Retro football game, accessible interface, credible working football world. Inspirations: Football Manager (world), Crusader Kings (people and interests), FC Pro 2 (retro accessibility), No. 10: Full Confidence (political interventions), Hometown FC (club identity and growth).

## Design thesis
The player builds an organisation, not a lineup. Found -> build -> delegate -> observe -> intervene -> evolve. A club must function for ten weeks without intervention, but different deliberate strategies must create different clubs over five seasons. Inbox, club hub, boardroom and external newspaper (The Echo) are interfaces to the same simulation, not independent event generators.

### DNA
Separate origin (location, catchment, starting assets), identity (youth, community, commercial, results) and evolving organisational culture (innovation, prudence, ambition). Founding traits should have tradeoffs. Culture changes through sustained hiring, investment and decisions, not toggling a modifier. Department DNA defines philosophy; mandate defines authority; budget defines resources. Do not conflate them.

### Organisation
Long-term departments: Football, Recruitment, Academy, Performance, Commercial, Operations, Finance, Community. Start small: staff may cover multiple functions; professionalisation is progression. Each department has leadership, staff, expertise, budget, capacity, facilities, DNA, mandate, knowledge, projects, performance and relationships. Hiring choices should change behaviour, not merely grant percentage bonuses. Staff have interests, ambition, methods, knowledge and conflicting priorities. Example: experienced local academy head builds schools network; ambitious innovator seeks specialist hires and technology. Neither is universally better.

### Autonomous decision loop
Observe actual state -> prioritise according to goals, DNA, knowledge and constraints -> consider alternative actions -> check authority, budget and capacity -> execute or escalate -> evaluate and learn. Cross-department dependencies are essential. Example: rising injuries trigger medical analysis, consultation with coach and possible facilities proposal. Avoid periodic arbitrary upgrade triggers.

### Chairman agency
Meetings have an agenda, information, disagreement, commitments and follow-up; not a relationship-point farming mechanic. Possible actions: review strategy, challenge approach, allocate resources, hire/review leaders, negotiate partnerships, commission research, intervene in cross-department disputes, develop facilities, engage members and council. Research has cost, duration, capacity, uncertain findings, sources and follow-up. Example stadium feasibility: demand, planning permission, cost, funding and financial return; then negotiate, request further evidence, defer or approve. Academy research: regional talent, school partnerships, integration. Commercial: market research and new revenue. Finance: audit and refinancing. Player should never have to decide for each footballer.

### Finance and facilities
Separate operating income/costs, capex, debt, commitments, budgets, cash and reserves. Model timing, maintenance, financing, opportunity cost, utilisation and staff complementarity. Facilities should be assets/projects, not just fixed-price levels. Illustrative stadium: £420k investment, £105k incremental annual revenue, £35k incremental annual costs, six-year simple payback before financing; not calibrated game values. Members' club capital and governance need realistic constraints, elections, promises and trust. Club health and chairman popularity can diverge.

### Communication
Operational updates, research findings, opportunities, escalations, approvals. Messages should cite actual state, sender, date, reason and linked dossier; avoid repeated noise. Quiet weeks are allowed. External newspaper reports fixtures, finances, world news and developments. Player can initiate work independently of inbox. Major decisions should have persistent consequences and follow-up.

### Example emergent season
Found youth/community club -> hire local academy leader -> commission talent study -> schools network -> coach fails to integrate youth -> joint meeting -> academy requests extra staff -> finance flags costs -> commercial finds youth sponsor -> TD sells veteran, academy supplies replacement -> AGM evaluates sporting, financial and community results. This is a causal example, not a scripted story.

## Actual V0.1 implementation
Single HTML, CSS and JS; central state s; D defines four departments (Football, Academy, Commercial, Finance). found/start create club, five traits with four points, two candidates per department, £180k starting cash, trust 60. tick advances 52-week year, 30 simplified matches, operations, projects, autonomous needs and election. launch checks cash reserve, budget, capacity, active project and delegated authority. finish updates network, sponsorship, strength, knowledge or facility. act supports meeting, focus, budget, authority, research, development, facility. render provides inbox, department tiles, accounts, football summary. LocalStorage save. Three major initiatives per week; meetings free once per department/week. Annual election can end career. No external dependencies.

## Critical gaps — verify rather than trust feature labels
- No actual league, opponents, fixtures, promotion/relegation, individual players or external football economy. W/D/L probability only. Lowest division is intended, not implemented.
- Staff skill/style differ but ambition and relation are stored without meaningful use. Academy focus does not change its project behaviour; DNA is mostly static. No post-founding recruitment/replacement or genuine staff negotiation.
- Autonomy is threshold-based with one generic development action, no alternative plans, cross-department collaboration or approval proposals. Inbox is an event log, no actionable decisions/dossiers, no Echo.
- Meetings return simple status text; research returns current state and canned recommendations, knowledge rarely matters. No meaningful uncertainty or follow-up.
- All departments start with £20k budget; £30k facility requires increasing budget. Budget increases do not reserve cash or enforce total allocations. No debt, contracts, membership dues, detailed revenue streams or committed future costs. No realistic financial calibration. Reserve warning cooldown uses week number without season, potentially suppressing warnings after rollover.
- Facility is a shared integer; no asset lifecycle. Project failures are silent in UI. Unlimited repeated manual development may inflate metrics; strength and sponsors lack long-term decay. Election is simple threshold formula; no actual membership groups, board votes or political campaigning.
- No modular architecture yet. No verified browser playtest in this handover. Previous chat reported 20 two-season simulations, 2,080 weeks, 360 completed projects and no runtime errors; test harness/results not bundled, so reproduce before relying on those claims. No proof of balance or fun.
- Provisional choices made by ChatGPT: four departments, starting cash, costs, thresholds, three initiatives, annual elections, two candidates. These are not user-approved balance values.

## Suggested development order
1. Audit existing Bible and related design documents against confirmed requirements; identify reusable systems rather than reinventing them. Earlier discussion referenced BIBLE.md/Master Bible V1.3, Hands_Off_FC_Team_Staff_Afdelingen_Blueprint_v03.md, DEVELOPMENT_LEDGER_MEETINGS_KENNIS_V2.md, FRONT_OFFICE_FC_CLUBSYSTEEM_ONDERZOEK_EN_AANPAK_V1.md, FRONT_OFFICE_FC_VIERLAGEN_BLUEPRINT_V1.md. Exact locations/versions not reverified; search repo.
2. Define modular state contracts for club, department, staff, finance, project, knowledge, communication and governance; preserve separation from football simulation.
3. Build a compelling vertical slice: Academy + Football + Finance + Commercial. One complete research-to-decision-to-consequence loop, competing staff approaches, genuine constraints, actionable inbox and feedback. Integrate credible football world rather than expand generic event count.
4. Validate passive and active play, divergent strategies, causal attribution, cash conservation, budget/authority enforcement, save/load, season rollover, election outcomes, no repetitive spam. Test at least five seasons for strategy divergence; cheap local deterministic simulations first.
5. Expand departments only once the core is fun. Do not run costly GitHub Actions or long Playwright batches without permission. Do not overwrite live baseline or publish this experiment automatically.

## Claude review assignment
Act as a critical game designer, football club governance specialist and simulation engineer. Read this handover and the exact HTML, then locate relevant existing Bible material and reusable engines. Distinguish implemented behaviour from aspiration. Identify why the current prototype may still feel like a simulator rather than a game. Propose a coherent architecture, realistic chairman activity catalogue, department autonomy model, finance/facility model and contextual inbox. Show concrete weekly and multi-season causal examples, competing strategies and tradeoffs. Prioritise a playable vertical slice and explicit acceptance tests. Challenge assumptions rather than merely endorse this design. Report which existing systems to reuse, replace or defer and why. Review first; do not merge or deploy automatically.
