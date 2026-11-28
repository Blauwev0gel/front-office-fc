# Acceptance criteria V2
Designed only; no tests executed in consolidation.
## Invariants
Cash reconciles; commitments settle once; restricted funds respected; budget not cash; no automatic debt; capacity not double booked; rejected funding/consent blocks build; no duplicate staff contracts; save/load retains decisions and seeded continuation; defaults exactly once; UI does not advance clock.
## P1 scenario matrix
Renew sponsor, seek alternative, defer, rejected mandate, insufficient cash, delayed payment, failed negotiation, save/load mid-offer, quiet week, annual review. Compare active vs passive chair under paired seed. Show decision → commitment → outcome → ALV evidence. Existing football remains playable.
## Gameplay gate
Human can explain role, identify next action without inbox, understand cost and risk, see result, distinguish two strategies, continue quiet week in one tap. Observe confusion, repetitive decisions, time to first meaningful choice and desire to continue. Bot success is not proof of fun. No arbitrary score threshold before baseline.
## Long-run
Four strategies: community, youth, commercial, ambitious. Cheap local paired seeds, start small then expand toward 10 seasons/20 seeds if runtime permits. Report distributions of insolvency, cash trough, promotion, payroll, debt, capacity, academy, sponsor retention, member confidence, unique decisions, autonomous work and duplicate messages. Sensitivity ±25/50% uncalibrated inputs. No guaranteed winning strategy.
## Release
Record exact SHA, test commands/results, failures, human vs bot, save compatibility, artifact parity and owner approval. Never reuse test results from other engines or commits. No heavy CI by default.
