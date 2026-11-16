# LedgerAI — Product Roadmap & Execution Plan

## Vision
An AI-native personal finance management platform engineered for speed, privacy, and actionable financial clarity.

---

## Milestone Phase 1: Core Foundation & Aesthetics (Issues #1 - #4)
- [x] #1: Project initialization (Next.js 14, Tailwind, shadcn/ui, Hono server structure)
- [x] #2: Dark-mode Fintech Dashboard Layout (Sidebar, Stat Cards, Header, Micro-interactions)
- [x] #3: Interactive Transaction Table & Recharts Analytics
- [x] #4: Finance Data Mock Service (`mock-service.ts`)

---

## Milestone Phase 2: API Contract & Persistence (Issues #5 - #8)
- [x] #5: OpenAPI 3.0 Contract Definition (`openapi.yml`)
- [x] #6: Hono Backend & In-Memory Controllers
- [x] #7: SQLite Prisma Schema & 500-Transaction Seed Script (`prisma/seed.ts`)
- [x] #8: Frontend & Backend Integration (replace mocks with real Hono API)

---

## Milestone Phase 3: AI Intelligence, Polish & Auth (Issues #9 - #12)
- [x] #9: AI Categorization & Spending Anomaly Detection Engine
- [x] #10: Production UX Polish (Skeleton loaders, Error boundary, Toast notifications)
- [x] #11: Vitest Integration Test Suite for Hono API Endpoints
- [x] #12: User Authentication Slice (Credentials authentication, password hashing, session tokens)

---

## Milestone Phase 4: Playwright End-to-End Suite & Bug Hardening (Issues #13 - #17)
- [x] #13: [e2e-test] Playwright User Login & Registration Flow
- [x] #14: [e2e-test] Playwright Add Income & Expense Transactions
- [x] #15: [e2e-test] Playwright Dashboard & Analytics Rendering
- [x] #16: [e2e-test] Playwright AI Category Suggestion & Anomaly Trigger
- [x] #17: [user-test-bug] Bug Triage, Reproduction & Hardening

---

## Milestone Phase 5: DevOps, Cloud IaC & CI/CD (Issues #18 - #25)
- [x] #18: [devops] Database Migration to PostgreSQL
- [x] #19: [devops] Production Multi-Stage Dockerfile (Standalone Next.js + Hono)
- [x] #20: [devops] Docker Compose Orchestration (App + PostgreSQL)
- [x] #21: [devops] Multi-Cloud Deployment Guide & Manifests (Render, Vercel, Railway)
- [x] #22: [devops] Production IaC with Strict Free-Tier Guardrails (GCP Terraform / AWS CloudFormation)
- [x] #23: [devops] GitHub Actions CI Pipeline (Lint, Vitest, Playwright E2E)
- [x] #24: [devops] Automated Cloud CD Deployment Pipeline
- [x] #25: [mvp] Final Documentation, Architecture Diagrams, and Milestone Summary

---

## Milestone Phase 6: DevOps & Observability (Issues #26 - #31)
- [x] #26: [devops] Separate development and production environments (`docker-compose.yml`, `docker-compose.prod.yml`, `.env.dev`, `.env.prod.example`)
- [x] #27: [devops] Manual CI/CD promotion trigger (dev → prod) with GitHub environment approval gate (`promote.yml`)
- [x] #28: [observability] Instrument backend with OpenTelemetry (metrics, traces, logs via OTel Collector, Prometheus, Tempo, Loki)
- [x] #29: [observability] Define application-specific metrics + Provisioned Grafana dashboard (`ledgerai-overview.json`)
- [x] #30: [observability] Alert rules on application metrics (error rate, p95 latency, anomaly spikes, service health probe)
- [x] #31: [observability] AI agent as on-call responder for alerts (automated incident triage, Loki/Prometheus diagnostics, remediation report)

---

## Managed Observability & Cloud Monitoring Rollout Plan
1. **Local & Containerized Baseline**:
   - Prometheus + Tempo + Loki + Grafana all orchestrated via Docker Compose for dev & self-hosted setups.
   - OpenTelemetry Collector acts as the universal pipeline agent receiving OTLP over gRPC/HTTP (`4317`/`4318`).
2. **Managed Cloud Monitoring Migration Path**:
   - **Google Cloud Operations Suite**: Transition OpenTelemetry Collector exporter from local Prometheus/Loki to Google Cloud Monitoring (Cloud Trace, Cloud Logging, and Cloud Operations Suite) using standard Google Cloud OTel Exporter (`googlecloud`).
   - **Grafana Cloud**: Zero-infrastructure telemetry routing by pointing OTel Collector directly to Grafana Cloud OTLP endpoint (Prometheus metrics, Tempo traces, Loki logs). No agent changes required in application code.
   - **Alertmanager Routing**: Route production alert webhooks from Managed Prometheus / Grafana Cloud to the `/api/alerts/webhook` endpoint or trigger the `.github/workflows/ai-incident-triage.yml` workflow via repository dispatch.
3. **Cost Control & Free-Tier Governance**:
   - **GCP**: Maintain strictly within the 50GB/month free logging allotment and 1,000,000 free Cloud Trace write spans.
   - **Grafana Cloud**: Utilize permanent free-tier limits (10,000 Prometheus active series, 50GB Loki logs with 30-day retention, 50GB Tempo traces).
   - **Sampling & Retention**: OpenTelemetry trace sampler configured to ratio-based sampling (`parentbased_traceidratio` at 0.1 for high-volume endpoints) in production overlay to prevent billable telemetry surges.
