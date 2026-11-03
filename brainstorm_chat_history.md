# LedgerAI — Brainstorm & Product Ideation Transcript

## Date: 2026-11-03
## Participants:
- **Product Manager (PM)**
- **Lead Developer (Dev)**
- **Lead QA Engineer (QA)**

---

### Phase 1: Problem Definition & Value Proposition
**PM**: Welcome team. We are setting out to build **LedgerAI**, an AI-native B2C Personal Finance Analyzer. Modern banking apps are fragmented, slow, and reactive rather than proactive. Users struggle to track discretionary spending, categorize messy merchant descriptions, and detect sudden anomalous spikes before month-end billing surprises.

**Dev**: Our core architecture needs to be lightning fast with zero bloat. Next.js App Router for server components, Tailwind CSS + shadcn/ui for a high-end dark-mode fintech interface (think Mercury / Ramp aesthetic), and a unified Hono server providing sub-millisecond API response times.

**QA**: From a quality and reliability perspective, financial data demands zero tolerance for calculation mistakes or regression bugs. We need strict integration tests with Vitest on all Hono controllers, and comprehensive Playwright E2E coverage for every core user flow (auth, transaction logging, charting, AI suggestions).

---

### Phase 2: Core Feature Specifications
**PM**: Let's align on the MVP feature breakdown:
1. **Interactive Dashboard**:
   - Total Balance, Monthly Inflow, Monthly Outflow, Net Savings Rate.
   - Anomaly counter alerting users to high-variance charges.
2. **Transaction Management**:
   - Tabular view with category pills (Food, Housing, Transport, Entertainment, Utilities, Salary, Investments).
   - Real-time search and category filtering.
   - Modal for manual entry with type toggle (Income vs Expense).
3. **AI Categorization & Anomaly Heuristics**:
   - Instant categorization suggestion based on merchant string (e.g., 'Starbucks' -> Dining, 'Uber' -> Transport).
   - Anomaly detection flagging transactions that exceed 2.5x the rolling category mean or sudden high-dollar charges.
4. **Visual Analytics**:
   - Cash flow area chart over time (Income vs Outflow).
   - Donut chart with category spending distribution.
5. **Budgets & Alerts**:
   - Visual progress bars for category budgets with threshold warnings (>80% amber, >100% red).

---

### Phase 3: Technical Architecture & Migration Strategy
**Dev**: Persistence strategy:
- Start development with **Prisma ORM and SQLite** for immediate local ergonomics and zero-config portability.
- Seed 500 realistic historical transactions spanning various categories and temporal spreads.
- For production, migrate seamlessly to **PostgreSQL** with Docker Compose orchestration.
- Containerization: Multi-stage Dockerfile packaging the standalone Next.js build and Hono server.

**QA**: We must enforce the E2E rule: every primary feature must have a dedicated Playwright test tagged with `e2e-test`. Also, if any UI or API quirks are found during test execution, we execute our formal Bug Protocol (`user-test-bug` issue #17).

---

### Phase 4: Cloud & Free-Tier Guardrails
**PM**: Cloud deployment must strictly honor **Free-Tier Limits**. We cannot incur accidental costs on GCP or AWS.
**Dev**: We will create production IaC with strict safeguards:
- GCP: e2-micro compute in free regions (us-central1/us-east1/us-west1), <=30GB standard disk, max instances = 1.
- Budget alert policies set to trigger at $0.01 to eliminate surprise billing.
- CI/CD automated via GitHub Actions with testing gating automated deployments.

**QA**: Ready to proceed. Let's document our respective role files (`pm.md`, `developer.md`, `qa-engineer.md`) and launch the backlog.
