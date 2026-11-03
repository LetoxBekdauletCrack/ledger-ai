import { test, expect } from '@playwright/test';

test.describe('Playwright E2E: User Authentication Flow', () => {
  test('should navigate to login page and fill demo credentials', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveTitle(/LedgerAI/);

    // Verify presence of login inputs
    const emailInput = page.locator('[data-testid="login-email-input"]');
    const passwordInput = page.locator('[data-testid="login-password-input"]');
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();

    // Click demo fill button
    const demoBtn = page.locator('[data-testid="demo-login-fill-btn"]');
    await demoBtn.click();

    await expect(emailInput).toHaveValue('demo@ledgerai.com');
    await expect(passwordInput).toHaveValue('password123');

    // Submit form
    await page.locator('[data-testid="login-submit-btn"]').click();

    // Should redirect to dashboard
    await expect(page).toHaveURL('/');
  });

  test('should reject invalid credentials and show error toast', async ({ page }) => {
    await page.goto('/login');
    await page.locator('[data-testid="login-email-input"]').fill('wrong@example.com');
    await page.locator('[data-testid="login-password-input"]').fill('invalidpassword');
    await page.locator('[data-testid="login-submit-btn"]').click();

    // Verify toast item appears
    const toast = page.locator('[data-testid="toast-item"]');
    await expect(toast).toBeVisible();
    await expect(toast).toContainText(/Failed|Invalid/i);
  });

  test('should register a new user successfully', async ({ page }) => {
    const randomEmail = `testuser_${Date.now()}@example.com`;
    await page.goto('/register');

    await page.locator('[data-testid="register-name-input"]').fill('Jane Doe');
    await page.locator('[data-testid="register-email-input"]').fill(randomEmail);
    await page.locator('[data-testid="register-password-input"]').fill('securepass123');
    await page.locator('[data-testid="register-submit-btn"]').click();

    // Should redirect to dashboard upon successful creation
    await expect(page).toHaveURL('/');
  });
});

