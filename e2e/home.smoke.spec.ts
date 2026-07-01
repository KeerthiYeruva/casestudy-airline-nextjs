import { expect, test } from '@playwright/test';

test.describe('public airline experience', () => {
  test('loads flight search and navigates to flight status', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Airline Management' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Flight Search' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Navigate to Flight Search' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Navigate to Flight Status' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Navigate to My Trips' })).toBeHidden();

    await page.getByRole('button', { name: 'Navigate to Flight Status' }).click();

    await expect(page.getByRole('heading', { name: 'Flight Status' })).toBeVisible();
    await expect(page.getByLabel('Search flights')).toBeVisible();
  });
});