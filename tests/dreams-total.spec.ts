import { expect, test } from '@playwright/test';
import { DreamsTotalPage } from './pages/DreamsTotalPage';

test.describe('Dreams Summary', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('dreams-total.html');
  });

  test('DS-01 Page has the correct heading and table', async ({ page }) => {
    const total = new DreamsTotalPage(page);
    await total.expectLoaded();
  });

  test('DS-02 Good Dreams count is 6', async ({ page }) => {
    const total = new DreamsTotalPage(page);
    await total.expectLoaded();
    await expect(
      total.rows.filter({ hasText: 'Good Dreams' }).locator('td').last()
    ).toHaveText('6');
  });

  test('DS-03 Bad Dreams count is 4', async ({ page }) => {
    const total = new DreamsTotalPage(page);
    await total.expectLoaded();
    await expect(
      total.rows.filter({ hasText: 'Bad Dreams' }).locator('td').last()
    ).toHaveText('4');
  });

  test('DS-04 Total Dreams count is 10', async ({ page }) => {
    const total = new DreamsTotalPage(page);
    await total.expectLoaded();
    await expect(
      total.rows.filter({ hasText: 'Total Dreams' }).locator('td').last()
    ).toHaveText('10');
  });

  test('DS-05 Recurring Dreams count is 2', async ({ page }) => {
    const total = new DreamsTotalPage(page);
    await total.expectLoaded();
    await expect(
      total.rows.filter({ hasText: 'Recurring Dreams' }).locator('td').last()
    ).toHaveText('2');
  });
});
