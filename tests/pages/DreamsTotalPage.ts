import { expect, Page } from '@playwright/test';

export class DreamsTotalPage {
  readonly page: Page;
  readonly rows: ReturnType<Page['locator']>;

  constructor(page: Page) {
    this.page = page;
    this.rows = page.locator('table tbody tr');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Dreams Summary' })).toBeVisible();
    await expect(this.page.getByRole('table')).toBeVisible();
  }

  async getStat(label: string): Promise<string> {
    const row = this.rows.filter({ hasText: label });
    return (await row.locator('td').last().textContent())?.trim() ?? '';
  }

  async expectStats(): Promise<void> {
    await expect(this.rows).toHaveCount(5);
    await expect(this.rows.filter({ hasText: 'Good Dreams' }).locator('td').last()).toHaveText('6');
    await expect(this.rows.filter({ hasText: 'Bad Dreams' }).locator('td').last()).toHaveText('4');
    await expect(this.rows.filter({ hasText: 'Total Dreams' }).locator('td').last()).toHaveText('10');
    await expect(this.rows.filter({ hasText: 'Recurring Dreams' }).locator('td').last()).toHaveText('2');
  }
}