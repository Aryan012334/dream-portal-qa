import { expect, Page } from '@playwright/test';

export type DreamEntry = {
  name: string;
  daysAgo: string;
  type: string;
};

export class DreamsDiaryPage {
  readonly page: Page;
  readonly rows: ReturnType<Page['locator']>;

  constructor(page: Page) {
    this.page = page;
    this.rows = page.locator('table tbody tr');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Dreams Diary' })).toBeVisible();
    await expect(this.page.getByRole('table')).toBeVisible();
  }

  async getEntries(): Promise<DreamEntry[]> {
    return this.rows.evaluateAll((rows) => rows.map((row) => {
      const cells = Array.from(row.querySelectorAll('td')).map((cell) => cell.textContent?.trim() ?? '');
      return { name: cells[0] ?? '', daysAgo: cells[1] ?? '', type: cells[2] ?? '' };
    }));
  }

  async expectValidEntries(): Promise<DreamEntry[]> {
    const entries = await this.getEntries();
    expect(entries).toHaveLength(10);
    for (const entry of entries) {
      expect(entry.name).not.toBe('');
      expect(entry.daysAgo).not.toBe('');
      expect(entry.type).toMatch(/^(Good|Bad)$/);
    }
    return entries;
  }

  getRecurringDreamNames(entries: DreamEntry[]): string[] {
    const occurrences = new Map<string, number>();
    for (const entry of entries) {
      occurrences.set(entry.name, (occurrences.get(entry.name) ?? 0) + 1);
    }
    return [...occurrences.entries()]
      .filter(([, count]) => count > 1)
      .map(([name]) => name)
      .sort();
  }
}