import { test, expect } from '@playwright/test';

test.describe('UI visual regression', () => {
  test('ui-tests page snapshots', async ({ page }) => {
    await page.goto('/ui-tests');
    await page.waitForLoadState('networkidle');

    // ensure cart opener is visible
    const openBtn = page.getByRole('button', { name: /open cart/i });
    await expect(openBtn).toBeVisible();

    // capture full page snapshot for visual diff
    await page.screenshot({ path: `screenshots/ui-tests-${Date.now()}.png`, fullPage: true });

    // Open cart and capture drawer
    await openBtn.click();
    const dialog = page.getByRole('dialog', { name: /shopping cart/i });
    await expect(dialog).toBeVisible();
    await dialog.screenshot({ path: `screenshots/cart-drawer-${Date.now()}.png` });
  });
});
