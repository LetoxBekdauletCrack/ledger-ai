# LedgerAI — Product Roadmap & Execution Plan

## Vision
An AI-native personal finance management platform engineered for speed, privacy, and actionable financial clarity.

---

## Milestone Phase 1: Core Foundation & Aesthetics (Issues #1 - #4)
- [ ] #1: Project initialization (Next.js 14, Tailwind, shadcn/ui, Hono server structure)
- [ ] #2: Dark-mode Fintech Dashboard Layout (Sidebar, Stat Cards, Header, Micro-interactions)
- [ ] #3: Interactive Transaction Table & Recharts Analytics
- [ ] #4: Finance Data Mock Service (`mock-service.ts`)

---

## Milestone Phase 2: API Contract & Persistence (Issues #5 - #8)
- [ ] #5: OpenAPI 3.0 Contract Definition (`openapi.yml`)
- [ ] #6: Hono Backend & In-Memory Controllers
- [ ] #7: SQLite Prisma Schema & 500-Transaction Seed Script (`prisma/seed.ts`)
- [ ] #8: Frontend & Backend Integration (replace mocks with real Hono API)

---

## Milestone Phase 3: AI Intelligence, Polish & Auth (Issues #9 - #12)
- [ ] #9: AI Categorization & Spending Anomaly Detection Engine
- [ ] #10: Production UX Polish (Skeleton loaders, Error boundary, Toast notifications)
- [ ] #11: Vitest Integration Test Suite for Hono API Endpoints
- [ ] #12: User Authentication Slice (Credentials authentication, password hashing, session tokens)

---

## Milestone Phase 4: Playwright End-to-End Suite & Bug Hardening (Issues #13 - #17)
- [ ] #13: [e2e-test] Playwright User Login & Registration Flow
- [ ] #14: [e2e-test] Playwright Add Income & Expense Transactions
- [ ] #15: [e2e-test] Playwright Dashboard & Analytics Rendering
- [ ] #16: [e2e-test] Playwright AI Category Suggestion & Anomaly Trigger
- [ ] #17: [user-test-bug] Bug Triage, Reproduction & Hardening

---

## Milestone Phase 5: DevOps, Cloud IaC & CI/CD (Issues #18 - #25)
- [ ] #18: [devops] Database Migration to PostgreSQL
- [ ] #19: [devops] Production Multi-Stage Dockerfile (Standalone Next.js + Hono)
- [ ] #20: [devops] Docker Compose Orchestration (App + PostgreSQL)
- [ ] #21: [devops] Multi-Cloud Deployment Guide & Manifests (Render, Vercel, Railway)
- [ ] #22: [devops] Production IaC with Strict Free-Tier Guardrails (GCP Terraform / AWS CloudFormation)
- [ ] #23: [devops] GitHub Actions CI Pipeline (Lint, Vitest, Playwright E2E)
- [ ] #24: [devops] Automated Cloud CD Deployment Pipeline
- [ ] #25: [mvp] Final Documentation, Architecture Diagrams, and Milestone Summary

