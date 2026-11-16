/* ---------- save ---------- */
function save() { return JSON.stringify(G); }
function load(s) { const g = JSON.parse(s); if (!g || g.v > VERSION) return false; G = g; G.ap = AP_FREE; if (G.v < 2) { G.v = 2; if (HOOK.acadMigrate) HOOK.acadMigrate(); } if (G.v < 3) { G.v = 3; if (HOOK.recMigrate) HOOK.recMigrate(); } return true; }

return {
  get G() { return G; }, set G(v) { G = v; }, HOOK, absStars, newStats,
  VERSION, SEASON_WEEKS, TIERS, REGIONS, ATTR, ATTR_L, POSW, POS_L, LINE, ROLES, ROLE, MAND, LEAN, STYLES, DNA, PRESS, PUSH, CAPREQ,
  rnd, ri, pick, chance, clamp, gauss, wpick, uid, ord, money, M, sc, S, tierAvg, stars, upd, wageFor, genPlayer, genStaff, ovr, staff, eff, man, staffName,
  sack, newGame, setDNA, staffBudget, finishStaff, finishMandates, finishPress, hire, genCands, fire, setMandate, talk, push, respond, msgView, endWeek, startSeason,
  pressView, pressAnswer, PRESS_IDS: () => G.press,
  sortTable, cname, myPos, expectedRank, teamStrength, pickXI, alignment, transferBudget, wageRatio, revenueAvg, playerWages, staffWages, ticketPrice, attendance, sponsorIncome,
  wxFor, EV, BR, cact, defineEvent, defineProposal, resolve, autoIndex, addMsg, setupPreseason, dofWork, REQ, POSW_KEYS: () => Object.keys(POSW), protectedIds, window_: () => window_(), defineBrief, BR, genBriefs, briefView, answerBrief, scoreTarget, squadNeeds, weakestPos, FOCUS, preTargets, preSetTarget, preToggleFocus, budgetCosts, weekForecast, finishPreseason, analysis, scorecard, strengthParts, xPts, forecast, PROP, queueEvent, later, secondOpinion, decideProposal, proposalView, meetingPot, nextMeeting, isMeeting, projWeekly, perk, record, avgRat, squadAvgRat, EV, sellPlayer, sign, genTarget, allowed, staffWeeklyFn: staffWeekly, objMet, promiseMet, bestPlayer, absWeek, save, load,
};
})();
if (typeof module !== 'undefined') module.exports = FO;
