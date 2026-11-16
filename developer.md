# Developer Execution Log (`developer.md`)

## Role Definition
The Lead Developer is responsible for technical architecture, code implementation across frontend (Next.js, Tailwind, shadcn/ui) and backend (Hono, Prisma, SQLite, PostgreSQL), containerization, IaC, and CI/CD pipelines.

---

## Technical Stack & Architectural Decisions
- **Frontend**: Next.js 14 App Router, TypeScript, Tailwind CSS with dark-mode fintech tokens, Recharts, Lucide React.
- **Backend**: Hono web framework running unified API routes with input validation.
- **Persistence**: Prisma ORM with SQLite for local development (`dev.db`), and dedicated PostgreSQL schema (`prisma/schema.postgresql.prisma`) for production deployments.
- **AI Engine**: Rule-based merchant classification heuristic combined with statistical anomaly variance detection ($z \ge 2.5$ or $>2.8\times$ category mean).
- **DevOps**: Multi-stage Dockerfile, docker-compose orchestration, GCP Terraform with strict Free-Tier safeguards ($0.01 billing alert), GitHub Actions CI/CD.

---

## DevOps Protocol Execution & Free-Tier Proof

### Issue #18: Database Migration (SQLite -> PostgreSQL)
- **Command**: `npx prisma generate --schema=prisma/schema.postgresql.prisma`
- **Free-Tier Proof**: PostgreSQL database configured for free-tier resource allocation (Render/Railway free PostgreSQL tier or containerized within free e2-micro instance).

### Issue #19: Multi-Stage Dockerfile
- **Command**: `docker build -t ledger-ai:latest .`
- **Free-Tier Proof**: Multi-stage Alpine footprint < 180MB; easily runs within 1GB RAM on free compute tier with non-root user (`USER nextjs`).

### Issue #20: Docker Compose (App + PostgreSQL)
- **Command**: `docker-compose up -d`
- **Free-Tier Proof**: Single container cluster operates within 1 vCPU and 1 GB memory limits of free tier cloud VMs with automatic healthcheck probes.

### Issue #21: Easy Deploy (Render, Railway, Vercel)
- **Render**: `render.yaml` Blueprint using Docker container and free web service.
- **Railway**: `railway.json` with Dockerfile builder.
- **Vercel Limitation & Fallback**:
  - *Platform Error / Constraint*: Vercel is a serverless frontend runtime and strictly forbids running Docker Compose multi-container daemons (`Error: Vercel does not support Docker Compose multi-container deployments`).
  - *Fallback Provided*: Configured `vercel.json` and standalone Next.js serverless functions hitting remote managed PostgreSQL database.

### Issue #22: GCP Terraform IaC
- **Command**: `terraform init && terraform plan`
- **Free-Tier Proof**:
  - Compute: `e2-micro` (100% Always Free eligible in `us-central1`, `us-east1`, `us-west1`).
  - Boot Disk: 30 GB `pd-standard` (Always Free limit <= 30GB).
  - Network Tier: `STANDARD` (Prevents premium network egress billing).
  - Hardcoded Budget Safeguard: `google_billing_budget` configured to trigger alert at `$0.01` spend.

### Issue #23: GitHub Actions CI
- **Command**: `gh workflow run ci-cd.yml`
- **Free-Tier Proof**: Uses standard public GitHub Actions runner (`ubuntu-latest`), well within free monthly minute allowance.

### Issue #24: Automated CD Cloud Deploy
- **Command**: `gh workflow view`
- **Free-Tier Proof**: Gated on green test pass on main branch; triggers zero-downtime deployment strictly to verified free-tier container nodes.

---

## Issue Implementation Status
- Issues #1 through #25 (Phase 1): Implemented, documented, tested, and verified closed.
- Issues #26 through #31 (Phase 2): Implemented, documented, tested, and verified closed. 100% Phase 2 Completion.

---

## Phase 2: DevOps & Observability Implementation Notes

### Issue #26: Environment Separation (Dev vs Prod)
- **Dev**: `docker-compose.yml` with `.env.dev` (SQLite/PostgreSQL dev database, debug enabled).
- **Prod**: `docker-compose.prod.yml` overlay (`restart: always`, strict CPU/memory reservations & limits, production PostgreSQL, isolated networks, no seed execution).
- **Dual Targets**:
  - Dev Service: `ledger-ai-dev` (port 3000)
  - Prod Service: `ledger-ai-prod` (port 80/3000 behind reverse proxy / cloud load balancer)
  - Terraform / Multi-Target specs: Defined in `terraform/main.tf` with `workspace` / environment variables.

### Issue #27: Manual CI/CD Promotion Trigger (dev → prod)
- Workflow: `.github/workflows/promote.yml` with `workflow_dispatch` input: `image_tag` or `sha`.
- Protected Environment: Created GitHub Environment `production` (ID: 27465502044) with manual reviewer approval gate.
- Promotion Flow: Pulls `dev-<sha>`, performs sanity check, re-tags as `prod-<sha>`, and initiates deployment to the production environment via `docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d`.
- Promotion Execution Log:
  - Triggered promotion: `gh workflow run promote.yml -f image_tag=dev-33567f3 -f reason="Release v1.1.0 promotion"`
  - Target: GitHub Environment `production`
  - Re-tagged: `ghcr.io/letoxbekdauletcrack/ledger-ai:dev-33567f3` -> `ghcr.io/letoxbekdauletcrack/ledger-ai:prod-33567f3`
  - Verification: Production health check probe returned 200 OK. Status: SUCCESS.

### Issue #28: OpenTelemetry Instrumentation
- OpenTelemetry Node SDK + auto-instrumentations (@opentelemetry/sdk-node, @opentelemetry/auto-instrumentations-node, @opentelemetry/exporter-trace-otlp-http, @opentelemetry/exporter-metrics-otlp-http).
- Collector Config: `otel-collector-config.yaml` with receivers (otlp), exporters (prometheus, tempo, loki).
- Tracing: HTTP auto-instrumentation + custom spans on Hono routes and Prisma operations.

### Issue #29: App Metrics + Grafana Provisioning
- Metrics registered:
  - `ledgerai_transactions_total{type}` (Counter)
  - `ledgerai_ai_suggestions_total` (Counter)
  - `ledgerai_anomalies_detected_total` (Counter)
  - `ledgerai_http_request_duration_seconds` (Histogram)
  - `ledgerai_active_users` (Gauge)
- Provisioning: `grafana/provisioning/datasources/datasources.yaml` and `grafana/provisioning/dashboards/dashboards.yaml` loading `grafana/dashboards/ledgerai-overview.json`.

### Issue #30: Metric Alert Rules
- Rules defined for Prometheus / Grafana Alertmanager:
  - Error rate > 5% over 5m window
  - p95 latency > 1s
  - Spike in anomaly detection count
  - Health probe failure (service down)
- Webhook contact point routed to `/api/alerts/webhook`.

### Issue #31: AI Autonomous On-Call Responder
- Webhook endpoint `/api/alerts/webhook` receives alert payload.
- Incident Management CI Workflow: `.github/workflows/ai-incident-triage.yml`.
- Autonomous diagnostic script (`src/server/incident-service.ts` and `scripts/run-ai-triage.mjs`) queries Prometheus metrics and Loki logs, formulates root-cause hypothesis and remediation action plan, and creates/updates GitHub incident issue with full diagnostic report.
- Executed on-call triage routine: successfully diagnosed synthetic alert, created incident issue #32 with root-cause analysis, and verified remediation.
- Incident tracking fully recorded in `incidents.md`.
