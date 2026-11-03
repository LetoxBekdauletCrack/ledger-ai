import { test, expect } from '@playwright/test';

test.describe('Playwright E2E: AI Suggestion and Anomaly Trigger', () => {
  test('should trigger AI category suggestion and allow one-click apply', async ({ page }) => {
    await page.goto('/');

    // Open transaction modal
    await page.locator('[data-testid="add-transaction-btn"]').click();
    await expect(page.locator('[data-testid="add-transaction-dialog"]')).toBeVisible();

    // Type 'Uber' into merchant
    await page.locator('[data-testid="input-merchant"]').fill('Uber Technologies');

    // Wait for AI Category Suggestion Pill to appear
    const aiPill = page.locator('[data-testid="ai-category-suggestion"]');
    await expect(aiPill).toBeVisible({ timeout: 5000 });
    await expect(aiPill).toContainText('Transport');

    // Click Apply
    await page.locator('[data-testid="apply-ai-category-btn"]').click();

    // Category select should now be 'Transport'
    const select = page.locator('[data-testid="select-category"]');
    await expect(select).toHaveValue('Transport');
  });

  test('should trigger anomaly warning on exorbitant amount and save with anomaly flag', async ({ page }) => {
    await page.goto('/');

    await page.locator('[data-testid="add-transaction-btn"]').click();

    // Enter exorbitant amount for Dining
    await page.locator('[data-testid="input-amount"]').fill('2850.00');
    await page.locator('[data-testid="input-merchant"]').fill('Ultra Luxury Caviar Tasting');
    await page.locator('[data-testid="select-category"]').selectOption('Dining');

    // Verify anomaly warning alert appears inside modal
    const warning = page.locator('[data-testid="anomaly-warning"]');
    await expect(warning).toBeVisible({ timeout: 5000 });
    await expect(warning).toContainText('Spending Anomaly Flag');

    // Submit transaction
    await page.locator('[data-testid="submit-transaction-btn"]').click();

    // Verify toast warning
    await expect(page.locator('[data-testid="toast-item"]')).toBeVisible();

    // Verify Anomaly pill rendered in table row
    const anomalyPill = page.locator('[data-testid="anomaly-pill"]').first();
    await expect(anomalyPill).toBeVisible();
    await expect(anomalyPill).toContainText('Anomaly');
  });
});

