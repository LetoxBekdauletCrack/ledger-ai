import { describe, it, expect, beforeAll } from 'vitest';
import { app } from '../server/index';

describe('Hono API Integration Tests', () => {
  it('GET /api/health returns 200 and healthy status', async () => {
    const res = await app.request('/api/health');
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('ok');
    expect(body.service).toContain('LedgerAI');
  });

  it('GET /api/analytics/summary returns correct financial metrics', async () => {
    const res = await app.request('/api/analytics/summary');
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('totalBalance');
    expect(body).toHaveProperty('monthlyInflow');
    expect(body).toHaveProperty('monthlyOutflow');
    expect(body).toHaveProperty('recentTrends');
    expect(body).toHaveProperty('categoryBreakdown');
    expect(Array.isArray(body.categoryBreakdown)).toBe(true);
  });

  it('GET /api/transactions returns transactions list', async () => {
    const res = await app.request('/api/transactions');
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    const first = body[0];
    expect(first).toHaveProperty('id');
    expect(first).toHaveProperty('amount');
    expect(first).toHaveProperty('category');
    expect(first).toHaveProperty('merchant');
  });

  it('POST /api/ai/suggest-category correctly predicts category', async () => {
    const res = await app.request('/api/ai/suggest-category', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ merchant: 'Whole Foods Market', description: 'Weekly groceries' }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.suggestedCategory).toBe('Groceries');
    expect(body.confidence).toBeGreaterThan(0.8);
  });

  it('POST /api/ai/suggest-category handles transport merchants', async () => {
    const res = await app.request('/api/ai/suggest-category', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ merchant: 'Uber Technologies', description: 'Ride across town' }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.suggestedCategory).toBe('Transport');
  });

  it('POST /api/ai/detect-anomalies flags large unusual amounts', async () => {
    const res = await app.request('/api/ai/detect-anomalies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 2450.00, category: 'Dining', type: 'EXPENSE' }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.isAnomaly).toBe(true);
    expect(body.reason).toBeDefined();
  });

  it('POST /api/transactions creates transaction and flags anomaly if threshold exceeded', async () => {
    const newTx = {
      amount: 1850.00,
      type: 'EXPENSE',
      category: 'Dining',
      merchant: 'Michelin Star Feast',
      description: 'Annual anniversary banquet',
      date: new Date().toISOString().split('T')[0],
    };

    const res = await app.request('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTx),
    });

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.amount).toBe(1850.00);
    expect(body.isAnomaly).toBe(true);
    expect(body.anomalyReason).toBeDefined();
  });

  it('POST /api/auth/login allows demo login with valid credentials', async () => {
    const res = await app.request('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'demo@ledgerai.com', password: 'password123' }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('token');
    expect(body.user.email).toBe('demo@ledgerai.com');
  });

  it('POST /api/auth/login rejects invalid credentials', async () => {
    const res = await app.request('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'unknown@user.com', password: 'badpassword' }),
    });
    expect(res.status).toBe(401);
  });
});

