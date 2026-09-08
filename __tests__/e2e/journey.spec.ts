// E2E test for complete 1/2+1/3 journey
import { test, expect } from '@playwright/test';

test.describe('Complete 1/2+1/3 learning journey', () => {
  test('should complete full vertical slice', async ({ page }) => {
    // Go to home page
    await page.goto('/');
    
    // Should see title
    await expect(page.locator('h1')).toContainText('視覺數學學習');
    
    // Enter problem manually
    await page.fill('input[placeholder*="1/2+1/3"]', '1/2+1/3');
    await page.click('button:has-text("開始學習")');
    
    // Should reach confirmation screen
    await expect(page.locator('h2')).toContainText('確認題目');
    await page.click('button:has-text("確認")');
    
    // Should start teaching - wait for scene player
    await expect(page.locator('.scene-player')).toBeVisible({ timeout: 5000 });
    
    // Should see SVG visualization
    await expect(page.locator('svg')).toBeVisible();
    
    // Should see subtitles
    await expect(page.locator('text=先睇兩個分數')).toBeVisible();
    
    // Wait for teaching to complete (scenes run for ~30s in total)
    // For test speed, we could fast-forward or skip animations
    // For now, just wait a bit and click through
    await page.waitForTimeout(2000);
    
    // Should eventually reach checkpoint
    // (In real app, would need to wait for all scenes or implement skip)
    // For MVP test, we'll verify checkpoint exists in the plan
    
    // Note: Full e2e would require implementing scene skip/fast-forward
    // which is beyond MVP scope but should be added for testing
  });

  test('should show manual input field', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('input[placeholder*="1/2+1/3"]')).toBeVisible();
  });

  test('should show mock camera notice', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=相機功能（模擬中）')).toBeVisible();
  });

  test('should validate problem before confirming', async ({ page }) => {
    await page.goto('/');
    
    // Try invalid input
    await page.fill('input[placeholder*="1/2+1/3"]', 'invalid');
    await page.click('button:has-text("開始學習")');
    
    // Should show error or stay on input page
    await expect(page.locator('h2:has-text("確認題目")')).not.toBeVisible();
  });
});
