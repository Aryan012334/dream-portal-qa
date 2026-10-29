import { expect, test } from '@playwright/test';
import { DreamsDiaryPage } from './pages/DreamsDiaryPage';
import { DreamsTotalPage } from './pages/DreamsTotalPage';

test.describe('Cross-Page Data Validation', () => {
  test('CP-01 Total Dreams count on summary page matches diary entry count', async ({ page }) => {
    const diary = new DreamsDiaryPage(page);
    await page.goto('dreams-diary.html');
    await diary.expectLoaded();
    const entries = await diary.getEntries();

    const totalPage = new DreamsTotalPage(page);
    await page.goto('dreams-total.html');
    await totalPage.expectLoaded();

    const totalText = await totalPage.getStat('Total Dreams');
    expect(entries).toHaveLength(Number(totalText));
  });

  test('CP-02 Good Dreams count on summary page matches diary data', async ({ page }) => {
    const diary = new DreamsDiaryPage(page);
    await page.goto('dreams-diary.html');
    await diary.expectLoaded();
    const entries = await diary.getEntries();
    const goodCount = entries.filter((e) => e.type === 'Good').length;

    const totalPage = new DreamsTotalPage(page);
    await page.goto('dreams-total.html');
    await totalPage.expectLoaded();

    const goodText = await totalPage.getStat('Good Dreams');
    expect(goodCount).toBe(Number(goodText));
  });

  test('CP-03 Bad Dreams count on summary page matches diary data', async ({ page }) => {
    const diary = new DreamsDiaryPage(page);
    await page.goto('dreams-diary.html');
    await diary.expectLoaded();
    const entries = await diary.getEntries();
    const badCount = entries.filter((e) => e.type === 'Bad').length;

    const totalPage = new DreamsTotalPage(page);
    await page.goto('dreams-total.html');
    await totalPage.expectLoaded();

    const badText = await totalPage.getStat('Bad Dreams');
    expect(badCount).toBe(Number(badText));
  });

  test('CP-04 Recurring Dreams count on summary page matches diary data', async ({ page }) => {
    const diary = new DreamsDiaryPage(page);
    await page.goto('dreams-diary.html');
    await diary.expectLoaded();
    const entries = await diary.getEntries();
    const recurringNames = diary.getRecurringDreamNames(entries);

    const totalPage = new DreamsTotalPage(page);
    await page.goto('dreams-total.html');
    await totalPage.expectLoaded();

    const recurringText = await totalPage.getStat('Recurring Dreams');
    expect(recurringNames).toHaveLength(Number(recurringText));
  });

  test('CP-05 Recurring dreams found in Diary are "Flying over mountains" and "Lost in maze"', async ({ page }) => {
    const diary = new DreamsDiaryPage(page);
    await page.goto('dreams-diary.html');
    await diary.expectLoaded();
    const entries = await diary.getEntries();
    const recurringNames = diary.getRecurringDreamNames(entries);

    expect(recurringNames).toContain('Flying over mountains');
    expect(recurringNames).toContain('Lost in maze');
  });
});
