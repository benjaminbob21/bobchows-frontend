# BobChows — Research Protocol (v1.1, updated Week 7)

**Project:** Collaborative Social Dining: Designing and Evaluating a Real-Time Group Food Ordering Platform
**Student:** Benjamin Bamisile (0100666)
**Committed early (Week 3) and revised (Week 7) so instruments, thresholds, and the deployment arrangement are fixed before features land.**

---

## 1. Research Questions (from Assignment 01)

- **RQ1 (primary):** How can a web application architecture synchronize a shared group cart and coordinate participant payments with low latency, consistency, and a usable ordering experience?
- **RQ2 (secondary):** What are the measurable usability and task-efficiency trade-offs when comparing a dedicated collaborative workflow against single-user ordering and a commercial group-ordering implementation?

RQ1 is the main question; RQ2 is evaluated as supporting evidence. The synchronization and payment-allocation methods compared are: (a) the current 5-second HTTP polling baseline, and (b) WebSocket (Socket.IO) push updates, behind a feature flag.

## 2. Study A — Comparative Usability Evaluation

**Design:** Within-subjects, 3 conditions, counterbalanced order (rotate with a 3×3 Latin square to cancel learning effects).

| Condition | Platform | Task |
|---|---|---|
| A — Single-user | BobChows | Order 2 items for yourself from a chosen restaurant, through checkout |
| B — Commercial baseline | Uber Eats | Order the same 2 items; task ends at "review order" screen (no real charge) |
| C — Collaborative | BobChows | Host a group order; 2 invited participants each add 1 item; complete group checkout |

**Participants:** 8–12 (classmates/friends), 18+, recruited by Week 8. Condition C requires scheduling 3 people at once — recruit in trios. Each participant signs a one-page informed-consent sheet (voluntary, may withdraw, no personal data collected; sessions may be screen-recorded for timing only).

**Measures (with thresholds):**
- **Task completion time** — from first interaction to checkout confirmation, extracted from screen-recording timestamps. *Target: collaborative condition within 1.5× of single-user condition median.*
- **Error rate** — coded events: wrong item, wrong quantity, navigation dead-end, retry after failure, or needing experimenter help. Errors / task attempts. *Target: ≤ 0.5 errors per task across conditions.*
- **Coordination errors** — in Condition C only: duplicate items, missed items, or payment-split disagreements among participants. *Target: ≤ 1 per group order.*
- **SUS** — standard 10-item System Usability Scale after each condition (3 SUS scores per participant). *Target: collaborative condition ≥ 70 (acceptable range).*

**Procedure:** Same device class per participant (their own laptop), quiet room, ~25 min per participant, one practice task on a throwaway site first.

**Data management:** Participants anonymized P01–P12. Raw data in `research/data.xlsx` (not committed with names); consent sheets kept offline. Only aggregate results appear in the final report.

## 3. Study B — Real-Time Sync & Payment Benchmark

**Goal:** Answer RQ1 with numbers: propagation latency, consistency, and payment-allocation correctness under concurrent group sessions.

**Workloads:** Simulated concurrent users at **10, 50, and 100** per group session, each adding/changing items at a scripted rate (1 action per 5 s per user, Poisson-distributed). Each workload runs for 5 minutes; 3 repetitions per configuration.

**Metrics and thresholds:**

| Metric | Definition | Target |
|---|---|---|
| State-propagation latency | p50 / p95 time from "participant adds item" → visible to all other participants | p95 ≤ 500 ms (WebSocket); polling baseline documented as ~5 s floor |
| Consistency (read-your-write) | Staleness window (ms) between a participant's update and its visibility on their own next read | p95 ≤ 1 s |
| Error rate under load | Failed updates / total updates | ≤ 1% |
| Payment allocation accuracy | Per-participant split amounts vs. server-computed ground truth (integer cents) | 100% match |
| Duplicate payment rate | Payments recorded twice for the same order line | 0 |

**Harness:** Node script using `socket.io-client` (or HTTP poller for the baseline) driving N simulated participants against a seeded group order; `mongostat` + server CPU sampled during runs.

**Plan B (important):** The current implementation syncs via **5 s polling**, not WebSockets. If the WebSocket upgrade slips, the benchmark compares **polling vs. WebSocket behind a feature flag** — the comparison itself answers RQ1 ("polling latency floor = 5 s vs. WebSocket p95 ≈ X ms") and is an honest, publishable trade-off either way.

## 4. Deployment Arrangement (resolved Week 7)

- **Target:** Render **Standard** instance (supports WebSockets; free tier does not). The benchmark and the final demo run on this instance.
- **Fallback:** If the Standard instance is not available, the benchmark runs locally (localhost) with the same harness and the limitation is documented; the polling-vs-WebSocket comparison is unaffected because both run on the same host.
- **Environment:** MongoDB Atlas (shared cluster) for persistence; Auth0 for auth; Stripe test mode for payments. All environment variables are injected via Render's dashboard, never committed.
- **Baseline discipline:** polling and WebSocket runs execute back-to-back on the same instance to keep the comparison fair.

## 5. Timeline (mapped to proposal)

| Week | Milestone |
|---|---|
| 3 | Protocol drafted + committed; SUS form, task scripts, data spreadsheet ready |
| 6–7 | Checkout/order lands → pilot Conditions A & B (2 pilots); thresholds + deployment arrangement fixed (this revision) |
| 8–9 | Group order + real-time sync lands → pilot Condition C; benchmark harness smoke test; **recruitment confirmed** |
| 9–11 | Run all sessions (12 × 25 min ≈ 3 afternoons); run benchmark matrix (3 workloads × 3 reps) |
| 11–12 | Analysis (means, SUS score calc, threshold pass/fail, charts), write-up in final report |

## 6. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Not enough participants / scheduling collisions | Recruit in trios by Week 8; over-recruit 25% |
| WebSocket never implemented | Plan B benchmark (polling vs socket, feature flag) |
| Uber Eats baseline charges real money | Task cutoff at review-order screen; no purchase |
| Render Standard instance unavailable | Localhost fallback with documented limitation; both transports on same host |
| Group order bug on trial day | Freeze a demo seed script + test data before Week 9; no deploys on trial days |
