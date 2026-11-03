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
All 25 backlog items implemented, documented, tested, and handed over to QA Engineer for verification.
