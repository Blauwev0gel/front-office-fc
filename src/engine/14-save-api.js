/* ---------- save ---------- */
function save() { return JSON.stringify(G); }
function load(s) { const g = JSON.parse(s); if (!g || g.v > VERSION) return false; G = g; G.ap = AP_FREE; if (!G.later) G.later = []; if (G.v < 2) { G.v = 2; if (HOOK.acadMigrate) HOOK.acadMigrate(); } if (G.v < 3) { G.v = 3; if (HOOK.recMigrate) HOOK.recMigrate(); } if (G.v < 4) { G.v = 4; delete G.grip; delete G.gripW; delete G.gripLog; if (G.flags) delete G.flags.gripWarn; } if (G.v < 5) { G.v = 5; const c = G.club; if (c && c.fac && c.fac.train >= 3 && !(c.assets && c.assets.base)) { c.assets = c.assets || {}; c.assets.base = { site: 'the club\'s own ground', quality: c.fac.train, held: 'own', rent: 0, community: 0, namedBy: null, since: G.season }; } } /* v5: an existing training level becomes a base the club owns (B58) */ if (HOOK.recExceptionMigrate) HOOK.recExceptionMigrate(); return true; } // v4: legacy finance exceptions reconciled on load

return {
  get G() { return G; }, set G(v) { G = v; }, HOOK, PARK, absStars, newStats,
  VERSION, SEASON_WEEKS, TIERS, REGIONS, ATTR, ATTR_L, POSW, POS_L, LINE, ROLES, ROLE, MAND, LEAN, STYLES, DNA, PRESS, PUSH, CAPREQ,
  rnd, ri, pick, chance, clamp, gauss, wpick, uid, ord, money, M, sc, S, orgOf, newCoach, ORG_MEAN, tierAvg, stars, upd, wageFor, genPlayer, genStaff, ovr, staff, eff, man, staffName,
  sack, newGame, setDNA, staffBudget, finishStaff, finishMandates, finishPress, hire, genCands, fire, setMandate, talk, push, respond, msgView, endWeek, startSeason,
  pressView, pressAnswer, PRESS_IDS: () => G.press,
  sortTable, cname, myPos, expectedRank, teamStrength, pickXI, alignment, transferBudget, wageRatio, revenueAvg, playerWages, staffWages, ticketPrice, attendance, sponsorIncome,
  wxFor, STATK, simOurMatch, agreeSale, releaseWinterKitty, EV, BR, cact, defineEvent, defineProposal, resolve, autoIndex, addMsg, setupPreseason, dofWork, REQ, POSW_KEYS: () => Object.keys(POSW), protectedIds, window_: () => window_(), defineBrief, BR, genBriefs, briefView, answerBrief, squadNeeds, weakestPos, FOCUS, preTargets, preSetTarget, preToggleFocus, budgetCosts, weekForecast, finishPreseason, analysis, scorecard, strengthParts, xPts, forecast, PROP, queueEvent, later, secondOpinion, decideProposal, proposalView, meetingPot, nextMeeting, isMeeting, projWeekly, perk, record, avgRat, squadAvgRat, EV, sellPlayer, sign, genTarget, staffWeeklyFn: staffWeekly, objMet, promiseMet, bestPlayer, absWeek, save, load,
};
})();
if (typeof module !== 'undefined') module.exports = FO;
