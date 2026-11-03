# LedgerAI — AI-Native Personal Finance & Anomaly Intelligence

[![CI/CD Pipeline](https://github.com/LetoxBekdauletCrack/ledger-ai/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/LetoxBekdauletCrack/ledger-ai/actions)
[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Hono](https://img.shields.io/badge/Hono-v4-E36002?style=flat&logo=hono)](https://hono.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v3-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Playwright](https://img.shields.io/badge/Playwright-E2E-green?style=flat&logo=playwright)](https://playwright.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-Integration-yellow?style=flat&logo=vitest)](https://vitest.dev/)
[![GCP Free Tier](https://img.shields.io/badge/GCP_Free_Tier-Strict_Guardrails-blue?style=flat&logo=google-cloud)](https://cloud.google.com/free)

**LedgerAI** is a high-performance, dark-mode B2C personal finance analyzer designed for proactive capital management. It combines sub-millisecond API response times, automated transaction classification, statistical spending anomaly detection, cash flow visualizations, and strict free-tier cloud deployment guardrails.

---

## 🏛️ System Architecture

```mermaid
graph TD
    subgraph Client["Frontend Client (Next.js 14 App Router)"]
        UI["Dark Mode Fintech Dashboard"]
        Cards["Metric Stat Cards"]
        Charts["Recharts Visuals (Cash Flow & Donut)"]
        Table["Transaction Table & Category Badges"]
        Modal["Add Transaction Modal & Live AI Pill"]
    end

    subgraph Server["Unified Backend Engine (Hono)"]
        Router["Hono Router (/api/*)"]
        AuthCtrl["Auth Controller (JWT / Password Hash)"]
        TxCtrl["Transactions Controller (CRUD)"]
        AnalyticsCtrl["Analytics Aggregator"]
        AICtrl["AI Engine (Categorization & Anomaly Heuristics)"]
    end

    subgraph Data["Persistence & Storage"]
        Prisma["Prisma ORM"]
        SQLite["SQLite (dev.db - 500 Seed Records)"]
        Postgres["PostgreSQL (Production Container)"]
    end

    subgraph Cloud["Free-Tier Cloud Infrastructure"]
        GCP["GCP Compute Engine (e2-micro Always-Free)"]
        Terraform["Terraform with $0.01 Budget Safeguard"]
        Docker["Multi-Stage Docker & Compose Cluster"]
    end

    UI --> Router
    Cards --> Router
    Charts --> Router
    Table --> Router
    Modal --> Router

    Router --> AuthCtrl
    Router --> TxCtrl
    Router --> AnalyticsCtrl
    Router --> AICtrl

    TxCtrl --> Prisma
    AnalyticsCtrl --> Prisma
    AICtrl --> Prisma
    AuthCtrl --> Prisma

    Prisma -.-> SQLite
    Prisma -.-> Postgres

    Docker --> Server
    Terraform --> GCP
```

---

## ✨ Core Features

1. **Dark-Mode Fintech Aesthetic**:
   - High-contrast visual hierarchy inspired by Mercury, Ramp, and Linear.
   - Micro-interactions, glowing badges, animated skeleton loaders, and responsive layout.

2. **Proactive AI Engine**:
   - **Auto-Categorization**: Heuristic pattern-matching engine that suggests appropriate spending categories (Groceries, Dining, Transport, Utilities, etc.) in real-time as users type merchant names.
   - **Statistical Anomaly Detection**: Evaluates transaction amounts against rolling historical category means and z-scores ($Z \ge 2.5$ or $>2.8\times$ category mean), warning users of unusual financial charges.

3. **Interactive Financial Analytics**:
   - Real-time Net Balance, Monthly Inflows, Monthly Outflows, and Net Savings Rate calculation.
   - Dual-gradient Cash Flow Area Chart (Income vs Expense dynamics).
   - Category Breakdown Donut Chart with color-coded badges.

4. **Category Budget Management**:
   - Real-time monthly spending progress bars with 80% warning alerts and hard threshold exceedance flags.

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+ (tested on Node 20 / 24)
- npm or pnpm

### 2. Installation & Setup
```bash
# Clone the repository
git clone https://github.com/LetoxBekdauletCrack/ledger-ai.git
cd ledger-ai

# Install dependencies
npm install

# Generate Prisma Client & Initialize SQLite Database with 500 Transactions
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
```

### 3. Running Locally
```bash
# Start Next.js development server
npm run dev

# Or run the production build
npm run build
npm run start
```
Visit [http://localhost:3000](http://localhost:3000) in your browser.
Default demo credentials: `demo@ledgerai.com` / `password123`.

---

## 🧪 Automated Testing Suite

LedgerAI enforces 100% automated test coverage across both API integration and browser user flows:

```bash
# 1. Run Vitest API Integration Tests (9/9 passing)
npm run test

# 2. Run Playwright End-to-End Suite (10/10 passing)
npx playwright test
```

### E2E Test Scenarios:
- **`e2e/auth.spec.ts`**: Login, registration, credential validation, session redirect.
- **`e2e/transactions.spec.ts`**: Logging income and expense transactions, table verification.
- **`e2e/dashboard.spec.ts`**: Verifying stat cards, Recharts containers, and search/category filters.
- **`e2e/ai-suggestion.spec.ts`**: Real-time AI category suggestion pill and anomaly warning triggers.

---

## 🐳 Docker & DevOps Deployment

### Multi-Stage Docker Build
```bash
# Build production Docker image
docker build -t ledger-ai:latest .

# Run container
docker run -p 3000:3000 ledger-ai:latest
```

### Docker Compose (App + PostgreSQL)
```bash
docker-compose up -d
```

### Free-Tier Cloud Deployments:
- **Render**: Configured via `render.yaml` with free web service and PostgreSQL database.
- **Railway**: Configured via `railway.json`.
- **Vercel**: Edge/Serverless deployment configured via `vercel.json` (serverless fallback due to platform compose constraints).
- **GCP Terraform (`terraform/main.tf`)**:
  - `e2-micro` instance in Always-Free region (`us-central1`).
  - Standard persistent disk limited to 30 GB.
  - Standard network tier.
  - Hardcoded `$0.01` billing alert shutdown safeguard to eliminate accidental charges.

