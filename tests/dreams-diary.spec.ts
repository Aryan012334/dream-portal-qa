import { expect, test } from '@playwright/test';
import { DreamsDiaryPage } from './pages/DreamsDiaryPage';

test.describe('Dreams Diary', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('dreams-diary.html');
  });

  test('DD-01 Page loads and table is visible', async ({ page }) => {
    const diary = new DreamsDiaryPage(page);
    await diary.expectLoaded();
  });

  test('DD-02 Table contains exactly 10 dream entries', async ({ page }) => {
    const diary = new DreamsDiaryPage(page);
    await diary.expectLoaded();
    const entries = await diary.getEntries();
    expect(entries).toHaveLength(10);
  });

  test('DD-03 All dream types are "Good" or "Bad"', async ({ page }) => {
    const diary = new DreamsDiaryPage(page);
    await diary.expectLoaded();
    const entries = await diary.getEntries();
    for (const entry of entries) {
      expect(entry.type).toMatch(/^(Good|Bad)$/);
    }
  });

  test('DD-04 Every row has Dream Name, Days Ago and Dream Type filled', async ({ page }) => {
    const diary = new DreamsDiaryPage(page);
    await diary.expectLoaded();
    const entries = await diary.getEntries();
    for (const entry of entries) {
      expect(entry.name).not.toBe('');
      expect(entry.daysAgo).not.toBe('');
      expect(entry.type).not.toBe('');
    }
  });

  test('DD-05 Days Ago values are valid non-negative numbers', async ({ page }) => {
    const diary = new DreamsDiaryPage(page);
    await diary.expectLoaded();
    const entries = await diary.getEntries();
    for (const entry of entries) {
      expect(Number(entry.daysAgo)).toBeGreaterThanOrEqual(0);
      expect(isNaN(Number(entry.daysAgo))).toBe(false);
    }
  });

  test('DD-06 Identifies the two recurring dreams from diary data', async ({ page }) => {
    const diary = new DreamsDiaryPage(page);
    await diary.expectLoaded();
    const entries = await diary.expectValidEntries();
    expect(diary.getRecurringDreamNames(entries)).toEqual(['Flying over mountains', 'Lost in maze']);
  });
});
