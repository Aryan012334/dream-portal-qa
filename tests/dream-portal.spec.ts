import { expect, test } from '@playwright/test';
import { DreamPortalHomePage } from './pages/DreamPortalHomePage';
import { DreamsDiaryPage } from './pages/DreamsDiaryPage';
import { DreamsTotalPage } from './pages/DreamsTotalPage';

test.describe('Dream Portal home', () => {
  test('shows loading state before revealing the portal', async ({ page }) => {
    const home = new DreamPortalHomePage(page);
    await home.open();
    await home.expectLoadingState();
    await home.expectLoadedState();
  });

  test('opens both dream pages in new tabs', async ({ page }) => {
    const home = new DreamPortalHomePage(page);
    await home.open();
    await home.expectLoadedState();

    const { diary, total } = await home.openDreamPages();
    await expect(diary).toHaveTitle('Dreams Diary');
    await expect(total).toHaveTitle('Dreams Total');
  });
});

test.describe('Dreams diary', () => {
  test('contains ten complete Good or Bad dream entries', async ({ page }) => {
    const diary = new DreamsDiaryPage(page);
    await page.goto('dreams-diary.html');
    await diary.expectLoaded();
    await diary.expectValidEntries();
  });

  test('identifies the two recurring dreams from diary data', async ({ page }) => {
    const diary = new DreamsDiaryPage(page);
    await page.goto('dreams-diary.html');
    const entries = await diary.expectValidEntries();
    expect(diary.getRecurringDreamNames(entries)).toEqual(['Flying over mountains', 'Lost in maze']);
  });
});

test.describe('Dreams summary', () => {
  test('shows the expected dream statistics', async ({ page }) => {
    const total = new DreamsTotalPage(page);
    await page.goto('dreams-total.html');
    await total.expectLoaded();
    await total.expectStats();
  });
});