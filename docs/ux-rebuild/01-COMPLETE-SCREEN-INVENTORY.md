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


## Remaining UI entry points

### src/ui/09-firstteam-review.js

| Registry ID | Function | Classification | Source status |
|---|---|---|---|
| SRC-080 | `vFirst()` | Screen/view/overlay candidate | Defined in source; route check required |
| SRC-081 | `ftTalkHtml()` | Component or helper | Defined in source; route check required |
| SRC-082 | `vAcademy2()` | Screen/view/overlay candidate | Defined in source; route check required |
| SRC-083 | `vReview2()` | Screen/view/overlay candidate | Defined in source; route check required |
| SRC-084 | `vSacked()` | Screen/view/overlay candidate | Defined in source; route check required |

### src/ui/10-inbox.js

| Registry ID | Function | Classification | Source status |
|---|---|---|---|
| SRC-085 | `markRead()` | Component or helper | Defined in source; route check required |
| SRC-086 | `inboxItems()` | Component or helper | Defined in source; route check required |
| SRC-087 | `nextFix()` | Component or helper | Defined in source; route check required |
| SRC-088 | `backersHtml()` | Component or helper | Defined in source; route check required |
| SRC-089 | `comingHtml()` | Component or helper | Defined in source; route check required |
| SRC-090 | `dossierCard()` | Component or helper | Defined in source; route check required |
| SRC-091 | `archiveHtml()` | Component or helper | Defined in source; route check required |
| SRC-092 | `pwMeetHtml()` | Component or helper | Defined in source; route check required |
| SRC-093 | `pwEvalHtml()` | Component or helper | Defined in source; route check required |
| SRC-094 | `agreementHtml()` | Component or helper | Defined in source; route check required |
| SRC-095 | `pathwayCard()` | Component or helper | Defined in source; route check required |
| SRC-096 | `credHtml()` | Component or helper | Defined in source; route check required |
| SRC-097 | `caseHtml()` | Component or helper | Defined in source; route check required |
| SRC-098 | `fdHtml()` | Component or helper | Defined in source; route check required |
| SRC-099 | `isDis()` | Component or helper | Defined in source; route check required |
| SRC-100 | `rowThumb()` | Component or helper | Defined in source; route check required |
| SRC-101 | `rowHtml()` | Component or helper | Defined in source; route check required |
| SRC-102 | `boxRow()` | Component or helper | Defined in source; route check required |
| SRC-103 | `deskRow()` | Component or helper | Defined in source; route check required |
| SRC-104 | `deskWeekHeader()` | Component or helper | Defined in source; route check required |
| SRC-105 | `deskNextMatch()` | Component or helper | Defined in source; route check required |
| SRC-106 | `deskDecisionCard()` | Component or helper | Defined in source; route check required |
| SRC-107 | `deskMatters()` | Component or helper | Defined in source; route check required |
| SRC-108 | `deskArchive()` | Screen/view/overlay candidate | Defined in source; route check required |
| SRC-109 | `vInbox()` | Screen/view/overlay candidate | Defined in source; route check required |

### src/ui/11-players.js

| Registry ID | Function | Classification | Source status |
|---|---|---|---|
| SRC-110 | `strengths()` | Component or helper | Defined in source; route check required |
| SRC-111 | `roleOf()` | Component or helper | Defined in source; route check required |
| SRC-112 | `starsTxt()` | Component or helper | Defined in source; route check required |
| SRC-113 | `pcard()` | Component or helper | Defined in source; route check required |
| SRC-114 | `hashN()` | Component or helper | Defined in source; route check required |
| SRC-115 | `storyOf()` | Component or helper | Defined in source; route check required |
| SRC-116 | `attrGroups()` | Component or helper | Defined in source; route check required |
| SRC-117 | `formBars()` | Component or helper | Defined in source; route check required |
| SRC-118 | `profileHtml()` | Screen/view/overlay candidate | Defined in source; route check required |
| SRC-119 | `scoutLine()` | Component or helper | Defined in source; route check required |

### src/ui/12-scenes-cards.js

| Registry ID | Function | Classification | Source status |
|---|---|---|---|
| SRC-120 | `sentEnds()` | Component or helper | Defined in source; route check required |
| SRC-121 | `clip2()` | Component or helper | Defined in source; route check required |
| SRC-122 | `splitSay()` | Component or helper | Defined in source; route check required |
| SRC-123 | `trayHtml()` | Component or helper | Defined in source; route check required |
| SRC-124 | `choiceHtml()` | Component or helper | Defined in source; route check required |
| SRC-125 | `ticOf()` | Component or helper | Defined in source; route check required |
| SRC-126 | `sceneHtml()` | Component or helper | Defined in source; route check required |
| SRC-127 | `vOpen()` | Screen/view/overlay candidate | Defined in source; route check required |
| SRC-128 | `cardOpts()` | Component or helper | Defined in source; route check required |
| SRC-129 | `oppShort()` | Component or helper | Defined in source; route check required |
| SRC-130 | `fstrip()` | Component or helper | Defined in source; route check required |
| SRC-131 | `previewCard()` | Component or helper | Defined in source; route check required |
| SRC-132 | `whyPanel()` | Component or helper | Defined in source; route check required |
| SRC-133 | `matchCard()` | Component or helper | Defined in source; route check required |
| SRC-134 | `weekReport()` | Screen/view/overlay candidate | Defined in source; route check required |
| SRC-135 | `msStrip()` | Component or helper | Defined in source; route check required |
| SRC-136 | `gazette()` | Screen/view/overlay candidate | Defined in source; route check required |

### src/ui/13-redbox-render.js

| Registry ID | Function | Classification | Source status |
|---|---|---|---|
| SRC-137 | `mailParas()` | Component or helper | Defined in source; route check required |
| SRC-138 | `mailTop()` | Component or helper | Defined in source; route check required |
| SRC-139 | `mailRows()` | Component or helper | Defined in source; route check required |
| SRC-140 | `mailBanner()` | Component or helper | Defined in source; route check required |
| SRC-141 | `mailReply()` | Component or helper | Defined in source; route check required |
| SRC-142 | `mailSent()` | Component or helper | Defined in source; route check required |
| SRC-143 | `bkStrip()` | Component or helper | Defined in source; route check required |
| SRC-144 | `msgHtml()` | Screen/view/overlay candidate | Defined in source; route check required |
| SRC-145 | `briefHtml()` | Screen/view/overlay candidate | Defined in source; route check required |
| SRC-146 | `mailCommit()` | Component or helper | Defined in source; route check required |
| SRC-147 | `big()` | Component or helper | Defined in source; route check required |
| SRC-148 | `mailSend()` | Component or helper | Defined in source; route check required |
| SRC-149 | `propHtml()` | Component or helper | Defined in source; route check required |
| SRC-150 | `tourCard()` | Component or helper | Defined in source; route check required |
| SRC-151 | `tabBadge()` | Component or helper | Defined in source; route check required |
| SRC-152 | `vBar()` | Screen/view/overlay candidate | Defined in source; route check required |
| SRC-153 | `advance()` | Component or helper | Defined in source; route check required |
| SRC-154 | `markFresh()` | Component or helper | Defined in source; route check required |
| SRC-155 | `render()` | Screen/view/overlay candidate | Defined in source; route check required |

### src/ui/14-matchday-gazette.js

| Registry ID | Function | Classification | Source status |
|---|---|---|---|
| SRC-156 | `mdStadium()` | Component or helper | Defined in source; route check required |
| SRC-157 | `mdPitch()` | Component or helper | Defined in source; route check required |
| SRC-158 | `mdPreview()` | Screen/view/overlay candidate | Defined in source; route check required |
| SRC-159 | `mdTeams()` | Screen/view/overlay candidate | Defined in source; route check required |
| SRC-160 | `mdMatch()` | Screen/view/overlay candidate | Defined in source; route check required |
| SRC-161 | `gzEdition()` | Screen/view/overlay candidate | Defined in source; route check required |
| SRC-162 | `mdPaper()` | Screen/view/overlay candidate | Defined in source; route check required |
| SRC-163 | `vMatchday()` | Screen/view/overlay candidate | Defined in source; route check required |
| SRC-164 | `mdKick()` | Screen/view/overlay candidate | Defined in source; route check required |

### src/ui/15-actions.js

| Registry ID | Function | Classification | Source status |
|---|---|---|---|
| SRC-165 | `readSetup()` | Component or helper | Defined in source; route check required |
| SRC-166 | `act()` | Component or helper | Defined in source; route check required |

### src/ui/16-boot.js

| Registry ID | Function | Classification | Source status |
|---|---|---|---|

