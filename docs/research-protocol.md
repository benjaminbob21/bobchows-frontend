# BobChows — Research Protocol (v1.0, drafted Week 3)

**Project:** Collaborative Social Dining: Designing and Evaluating a Real-Time Group Food Ordering Platform
**Student:** Benjamin Bamisile (0100666)
**Committed early (Week 3) so instruments, recruitment, and analysis are ready before features land.**

---

## 1. Research Questions (from Assignment 01)

- **RQ1:** How can a web application architecture be optimized to support low-latency, multi-user session state synchronization and itemized payment splitting during concurrent group ordering?
- **RQ2:** What are the measurable usability and task-efficiency trade-offs when comparing a dedicated collaborative workflow against single-user ordering and commercial group-ordering implementations?

## 2. Study A — Comparative Usability Evaluation

**Design:** Within-subjects, 3 conditions, counterbalanced order (rotate with a 3×3 Latin square to cancel learning effects).

| Condition | Platform | Task |
|---|---|---|
| A — Single-user | BobChows | Order 2 items for yourself from a chosen restaurant, through checkout |
| B — Commercial baseline | Uber Eats | Order the same 2 items; task ends at "review order" screen (no real charge) |
| C — Collaborative | BobChows | Host a group order; 2 invited participants each add 1 item; complete group checkout |

**Participants:** 8–12 (classmates/friends), 18+, recruited by Week 8. Condition C requires scheduling 3 people at once — recruit in trios. Each participant signs a one-page informed-consent sheet (voluntary, may withdraw, no personal data collected; sessions may be screen-recorded for timing only).

**Measures:**
- **Task completion time** — from first interaction to checkout confirmation, extracted from screen-recording timestamps.
- **Error rate** — coded events: wrong item, wrong quantity, navigation dead-end, retry after failure, or needing experimenter help. Errors / task attempts.
- **SUS** — standard 10-item System Usability Scale after each condition (3 SUS scores per participant).

**Procedure:** Same device class per participant (their own laptop), quiet room, ~25 min per participant, one practice task on a throwaway site first.

**Data management:** Participants anonymized P01–P12. Raw data in `research/data.xlsx` (not committed with names); consent sheets kept offline. Only aggregate results appear in the final report.

## 3. Study B — Real-Time Sync Benchmark

**Goal:** Answer RQ1 with numbers: propagation latency and throughput under concurrent group sessions.

**Metrics:**
- State-propagation latency: p50 / p95 time from "participant adds item" → visible to all other participants.
- Throughput: messages/s at 10, 50, 100 simulated concurrent users.
- Consistency: read-your-write staleness window (ms) on order state reads.
- Error rate under load (failed updates / total updates).

**Harness:** Node script using `socket.io-client` (or HTTP poller for baseline) driving N simulated participants against a seeded group order; `mongostat` + server CPU sampled during runs. Runs against the deployed Render instance (free-tier limitations documented as a threat to validity).

**Plan B (important):** The current implementation syncs via **5 s polling**, not WebSockets. If the WebSocket upgrade slips, the benchmark compares **polling vs. WebSocket behind a feature flag** — the comparison itself answers RQ1 ("polling latency floor = 5 s vs. WebSocket p95 ≈ X ms") and is an honest, publishable trade-off either way.

## 4. Timeline (mapped to proposal)

| Week | Milestone |
|---|---|
| 3 (now) | This protocol drafted + committed; SUS form, task scripts, data spreadsheet ready |
| 6–7 | Checkout/order lands → pilot Conditions A & B (2 pilots) |
| 8–9 | Group order + real-time sync lands → pilot Condition C; benchmark harness smoke test; **recruitment confirmed** |
| 9–11 | Run all sessions (12 × 25 min ≈ 3 afternoons); run benchmark matrix |
| 11–12 | Analysis (means, SUS score calc, charts), write-up in final report |

## 5. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Not enough participants / scheduling collisions | Recruit in trios by Week 8; over-recruit 25% |
| WebSocket never implemented | Plan B benchmark (polling vs socket, feature flag) |
| Uber Eats baseline charges real money | Task cutoff at review-order screen; no purchase |
| Free-tier Render skews benchmark | Document limitation; run baseline and socket tests back-to-back on same instance |
| Group order bug on trial day | Freeze a demo seed script + test data before Week 9; no deploys on trial days |
