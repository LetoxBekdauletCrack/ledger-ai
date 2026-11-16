# LedgerAI — Incident Management Log (`incidents.md`)

This log tracks all production and observability incidents detected by Prometheus/Grafana alert rules and triaged by the autonomous AI on-call responder.

---

## Incident History

| Incident ID | Timestamp | Alert Name | Severity | Status | GitHub Issue | Root Cause Summary |
|:---:|:---:|:---|:---:|:---:|:---:|:---|
| *Awaiting alerts* | - | - | - | - | - | - |

---

## Incident Severity Matrix
- **P1 - Critical**: Service down, health probe failures, complete API unresponsiveness.
- **P2 - High**: Error rate > 5%, latency p95 > 1s, sudden massive surge in financial anomalies.
- **P3 - Warning**: Slow API response, minor budget warning alerts, transient Prometheus scrape gaps.
- **P4 - Info**: Routine synthetic test alerts and verification probes.
| INC-1794836938251 | 2026-11-16T13:48:58.251Z | HighLatencyP95 | WARNING | Resolved | #local | Full table scans on unindexed category aggregation during peak analytics queries. |
| INC-1794837678949 | 2026-11-16T14:01:18.949Z | HighLatencyP95 | WARNING | Resolved | #local | Full table scans on unindexed category aggregation during peak analytics queries. |
| INC-1794837945521 | 2026-11-16T14:05:45.521Z | HighLatencyP95 | WARNING | Resolved | #32 | Full table scans on unindexed category aggregation during peak analytics queries combined with Prisma connection pool saturation. |
| INC-1794838778947 | 2026-11-16T14:19:38.947Z | HighLatencyP95 | WARNING | Resolved | #local | Full table scans on unindexed category aggregation during peak analytics queries. |
| INC-1794839483309 | 2026-11-16T14:31:23.309Z | HighLatencyP95 | WARNING | Resolved | #local | Full table scans on unindexed category aggregation during peak analytics queries. |
| INC-1794839547517 | 2026-11-16T14:32:27.517Z | HighLatencyP95 | WARNING | Resolved | #local | Full table scans on unindexed category aggregation during peak analytics queries. |
