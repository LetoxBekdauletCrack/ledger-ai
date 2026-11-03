import { test, expect } from '@playwright/test';

test.describe('Playwright E2E: Add Income and Expense Transactions Flow', () => {
  test('should open add transaction modal, fill expense, and verify in table', async ({ page }) => {
    await page.goto('/');

    // Wait for stat cards and table to load
    await expect(page.locator('[data-testid="stat-total-balance"]')).toBeVisible({ timeout: 10000 });

    // Click Add Transaction button
    const addBtn = page.locator('[data-testid="add-transaction-btn"]');
    await addBtn.click();

    // Verify modal is open
    const modal = page.locator('[data-testid="add-transaction-dialog"]');
    await expect(modal).toBeVisible();

    // Fill form
    await page.locator('[data-testid="input-amount"]').fill('45.50');
    await page.locator('[data-testid="input-merchant"]').fill('E2E Test Coffee Shop');
    await page.locator('[data-testid="select-category"]').selectOption('Dining');
    await page.locator('[data-testid="input-description"]').fill('Morning team brew');

    // Submit
    await page.locator('[data-testid="submit-transaction-btn"]').click();

    // Modal closes
    await expect(modal).not.toBeVisible();

    // Verify toast notification
    await expect(page.locator('[data-testid="toast-item"]')).toBeVisible();

    // Verify row appears in transaction table
    await expect(page.locator('text=E2E Test Coffee Shop').first()).toBeVisible();
    await expect(page.locator('text=$45.50').first()).toBeVisible();
  });

  test('should open modal, add income transaction, and verify in table', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('[data-testid="stat-total-balance"]')).toBeVisible({ timeout: 10000 });

    // Open modal
    await page.locator('[data-testid="add-transaction-btn"]').click();

    // Toggle to Income
    await page.locator('button:has-text("Income (Inflow)")').click();

    // Fill form
    await page.locator('[data-testid="input-amount"]').fill('1500.00');
    await page.locator('[data-testid="input-merchant"]').fill('E2E Consulting Retainer');
    await page.locator('[data-testid="select-category"]').selectOption('Salary');

    // Submit
    await page.locator('[data-testid="submit-transaction-btn"]').click();

    // Modal closes
    await expect(page.locator('[data-testid="add-transaction-dialog"]')).not.toBeVisible();

    // Verify new income transaction in table
    await expect(page.locator('text=E2E Consulting Retainer').first()).toBeVisible();
    await expect(page.locator('text=+$1,500.00').first()).toBeVisible();
  });
});

