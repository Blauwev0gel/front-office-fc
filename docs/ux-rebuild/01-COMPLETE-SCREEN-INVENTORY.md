# Complete screen inventory — source-grounded register

**Source baseline:** `chatgpt` commit `6b70e70570db704071663859b3cb2c622be08d7f` (2026-11-17). This inventory is an audit of the current **source**, not a claim of visual/browser coverage. A render helper is catalogued even where it is not a standalone page; reachability will be decided in the screen specification. Screen IDs are stable within this plan.

## Definitions and coverage

- **Page**: a full-screen phase or global destination; **view**: a subtab, profile or report; **overlay**: a modal/sheet; **state**: a distinct conditional mode; **component**: reusable renderer not itself a route.
- The UI is assembled by `build.py` from numbered fragments sharing scope; a file name does **not** imply a page.
- 'Source-defined' means code exists. 'Reachable' means the action/phase route is found. 'Browser verified' means a scenario was actually exercised (not performed in this audit).

## Complete UI entry point index

### src/ui/00-text-mode.js

| Registry ID | Function | Classification | Source status |
|---|---|---|---|

### src/ui/01-core.js

| Registry ID | Function | Classification | Source status |
|---|---|---|---|
| SRC-001 | `saveGame()` | Component or helper | Defined in source; route check required |
| SRC-002 | `hasSave()` | Component or helper | Defined in source; route check required |
| SRC-003 | `loadGame()` | Component or helper | Defined in source; route check required |
| SRC-004 | `wipe()` | Component or helper | Defined in source; route check required |
| SRC-005 | `toast()` | Component or helper | Defined in source; route check required |
| SRC-006 | `setClub()` | Component or helper | Defined in source; route check required |
| SRC-007 | `lum()` | Component or helper | Defined in source; route check required |
| SRC-008 | `crest()` | Component or helper | Defined in source; route check required |
| SRC-009 | `quickStart()` | Component or helper | Defined in source; route check required |

### src/ui/02-setup.js

| Registry ID | Function | Classification | Source status |
|---|---|---|---|
| SRC-010 | `vTitle()` | Screen/view/overlay candidate | Defined in source; route check required |
| SRC-011 | `vSetupDNA()` | Screen/view/overlay candidate | Defined in source; route check required |
| SRC-012 | `staffCard()` | Component or helper | Defined in source; route check required |
| SRC-013 | `numbers()` | Component or helper | Defined in source; route check required |
| SRC-014 | `vSetupStaff()` | Screen/view/overlay candidate | Defined in source; route check required |
| SRC-015 | `says()` | Component or helper | Defined in source; route check required |
| SRC-016 | `sliderRows()` | Component or helper | Defined in source; route check required |
| SRC-017 | `staffHead()` | Component or helper | Defined in source; route check required |
| SRC-018 | `leanNote()` | Component or helper | Defined in source; route check required |
| SRC-019 | `vSetupMandates()` | Screen/view/overlay candidate | Defined in source; route check required |
| SRC-020 | `recPlanBlock()` | Component or helper | Defined in source; route check required |

### src/ui/03-summer-preseason-press.js

| Registry ID | Function | Classification | Source status |
|---|---|---|---|
| SRC-021 | `seasonAdviceBlock()` | Component or helper | Defined in source; route check required |
| SRC-022 | `meetingContext()` | Component or helper | Defined in source; route check required |
| SRC-023 | `ddBlock()` | Component or helper | Defined in source; route check required |
| SRC-024 | `mtCard()` | Component or helper | Defined in source; route check required |
| SRC-025 | `vSummer2()` | Screen/view/overlay candidate | Defined in source; route check required |
| SRC-026 | `ddSchedule()` | Component or helper | Defined in source; route check required |
| SRC-027 | `vPreseason()` | Screen/view/overlay candidate | Defined in source; route check required |
| SRC-028 | `vPress()` | Screen/view/overlay candidate | Defined in source; route check required |

### src/ui/04-masthead-news.js

| Registry ID | Function | Classification | Source status |
|---|---|---|---|
| SRC-029 | `foRoot()` | Component or helper | Defined in source; route check required |
| SRC-030 | `foSection()` | Component or helper | Defined in source; route check required |
| SRC-031 | `masthead()` | Component or helper | Defined in source; route check required |
| SRC-032 | `foLocalMenu()` | Component or helper | Defined in source; route check required |
| SRC-033 | `tabs()` | Component or helper | Defined in source; route check required |
| SRC-034 | `vNews()` | Screen/view/overlay candidate | Defined in source; route check required |

### src/ui/05-pitches-squad-money.js

| Registry ID | Function | Classification | Source status |
|---|---|---|---|
| SRC-035 | `pitchCard()` | Component or helper | Defined in source; route check required |
| SRC-036 | `pitchDeck()` | Screen/view/overlay candidate | Defined in source; route check required |
| SRC-037 | `meetingBlock()` | Screen/view/overlay candidate | Defined in source; route check required |
| SRC-038 | `vAcademy()` | Screen/view/overlay candidate | Defined in source; route check required |
| SRC-039 | `p90()` | Component or helper | Defined in source; route check required |
| SRC-040 | `squadSeg()` | Component or helper | Defined in source; route check required |
| SRC-041 | `recRow()` | Component or helper | Defined in source; route check required |
| SRC-042 | `vRecruit2()` | Screen/view/overlay candidate | Defined in source; route check required |
| SRC-043 | `vMoney2()` | Screen/view/overlay candidate | Defined in source; route check required |
| SRC-044 | `vPitch()` | Screen/view/overlay candidate | Defined in source; route check required |
| SRC-045 | `vSquad()` | Screen/view/overlay candidate | Defined in source; route check required |
| SRC-046 | `spark()` | Component or helper | Defined in source; route check required |
| SRC-047 | `vMoney()` | Screen/view/overlay candidate | Defined in source; route check required |

### src/ui/06-sheets-ticker.js

| Registry ID | Function | Classification | Source status |
|---|---|---|---|
| SRC-048 | `vSheet()` | Screen/view/overlay candidate | Defined in source; route check required |
| SRC-049 | `previewAlign()` | Component or helper | Defined in source; route check required |
| SRC-050 | `vTicker()` | Screen/view/overlay candidate | Defined in source; route check required |
| SRC-051 | `startTicker()` | Component or helper | Defined in source; route check required |
| SRC-052 | `tick()` | Component or helper | Defined in source; route check required |

### src/ui/07-club-league.js

| Registry ID | Function | Classification | Source status |
|---|---|---|---|
| SRC-053 | `secCommercial()` | Component or helper | Defined in source; route check required |
| SRC-054 | `secMarketing()` | Component or helper | Defined in source; route check required |
| SRC-055 | `secPromises()` | Component or helper | Defined in source; route check required |
| SRC-056 | `vClub2()` | Screen/view/overlay candidate | Defined in source; route check required |
| SRC-057 | `vLeague2()` | Screen/view/overlay candidate | Defined in source; route check required |

### src/ui/08-departments.js

| Registry ID | Function | Classification | Source status |
|---|---|---|---|
| SRC-058 | `spark()` | Component or helper | Defined in source; route check required |
| SRC-059 | `vDepts()` | Screen/view/overlay candidate | Defined in source; route check required |
| SRC-060 | `headLine()` | Component or helper | Defined in source; route check required |
| SRC-061 | `headCard()` | Screen/view/overlay candidate | Defined in source; route check required |
| SRC-062 | `authHtml()` | Component or helper | Defined in source; route check required |
| SRC-063 | `headBtns()` | Component or helper | Defined in source; route check required |
| SRC-064 | `instinctRow()` | Component or helper | Defined in source; route check required |
| SRC-065 | `fillCol()` | Component or helper | Defined in source; route check required |
| SRC-066 | `stadiumSvg()` | Component or helper | Defined in source; route check required |
| SRC-067 | `comOverview()` | Component or helper | Defined in source; route check required |
| SRC-068 | `comDecisions()` | Component or helper | Defined in source; route check required |
| SRC-069 | `mkOverview()` | Component or helper | Defined in source; route check required |
| SRC-070 | `mkDecisions()` | Component or helper | Defined in source; route check required |
| SRC-071 | `planCard()` | Screen/view/overlay candidate | Defined in source; route check required |
| SRC-072 | `bizOverview()` | Component or helper | Defined in source; route check required |
| SRC-073 | `acPyramid()` | Component or helper | Defined in source; route check required |
| SRC-074 | `acOverview()` | Component or helper | Defined in source; route check required |
| SRC-075 | `acDecisions()` | Component or helper | Defined in source; route check required |
| SRC-076 | `squadPlanHtml()` | Component or helper | Defined in source; route check required |
| SRC-077 | `rxOverview()` | Component or helper | Defined in source; route check required |
| SRC-078 | `rxDecisions()` | Component or helper | Defined in source; route check required |
| SRC-079 | `vDept()` | Screen/view/overlay candidate | Defined in source; route check required |

