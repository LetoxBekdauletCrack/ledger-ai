import { test, expect } from '@playwright/test';

test.describe('Playwright E2E: Dashboard and Analytics Charts View', () => {
  test('should display all stat cards with financial values', async ({ page }) => {
    await page.goto('/');

    const totalBalance = page.locator('[data-testid="stat-total-balance"]');
    await expect(totalBalance).toBeVisible({ timeout: 10000 });
    await expect(totalBalance).toContainText('$');

    const inflow = page.locator('[data-testid="stat-monthly-inflow"]');
    await expect(inflow).toBeVisible();
    await expect(inflow).toContainText('$');

    const outflow = page.locator('[data-testid="stat-monthly-outflow"]');
    await expect(outflow).toBeVisible();
    await expect(outflow).toContainText('$');

    const savingsRate = page.locator('[data-testid="stat-savings-rate"]');
    await expect(savingsRate).toBeVisible();
    await expect(savingsRate).toContainText('%');

    const anomalies = page.locator('[data-testid="stat-anomalies"]');
    await expect(anomalies).toBeVisible();
  });

  test('should render Recharts analytical components and budget progress', async ({ page }) => {
    await page.goto('/');

    // Check Cash Flow chart card
    const cashFlow = page.locator('[data-testid="cash-flow-chart"]');
    await expect(cashFlow).toBeVisible();

    // Check Expense Breakdown chart card
    const breakdown = page.locator('[data-testid="category-breakdown-chart"]');
    await expect(breakdown).toBeVisible();

    // Check Budgets card
    const budgets = page.locator('[data-testid="budgets-card"]');
    await expect(budgets).toBeVisible();
  });

  test('should filter transactions by search keyword and category', async ({ page }) => {
    await page.goto('/');

    // Search filter
    const searchInput = page.locator('[data-testid="transaction-search-input"]');
    await searchInput.fill('Whole Foods');
    await page.waitForTimeout(400);

    // Verify filtered table results
    const table = page.locator('[data-testid="transactions-table"]');
    await expect(table).toContainText('Whole Foods');

    // Category filter: clear search first so both filters don't restrict to empty
    await searchInput.fill('');
    const categorySelect = page.locator('[data-testid="category-filter-select"]');
    await categorySelect.selectOption('Transport');
    await page.waitForTimeout(500);

    await expect(table).toContainText('Transport');
  });
});

