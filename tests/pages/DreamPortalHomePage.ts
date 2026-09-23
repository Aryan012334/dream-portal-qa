import { expect, Page } from '@playwright/test';

export class DreamPortalHomePage {
  readonly page: Page;
  readonly loadingMessage: ReturnType<Page['getByText']>;
  readonly myDreamsButton: ReturnType<Page['getByRole']>;

  constructor(page: Page) {
    this.page = page;
    this.loadingMessage = page.getByText('Loading your dream portal...');
    this.myDreamsButton = page.getByRole('button', { name: 'My Dreams' });
  }

  async open(): Promise<void> {
    await this.page.goto('./');
  }

  async expectLoadingState(): Promise<void> {
    await expect(this.loadingMessage).toBeVisible();
    await expect(this.myDreamsButton).toBeHidden();
  }

  async expectLoadedState(): Promise<void> {
    await expect(this.myDreamsButton).toBeVisible({ timeout: 5000 });
    await expect(this.loadingMessage).toBeHidden();
    await expect(this.page.getByRole('heading', { name: 'Dream Portal' })).toBeVisible();
  }

  async openDreamPages(): Promise<{ diary: Page; total: Page }> {
    const pagesBeforeClick = this.page.context().pages();
    await this.myDreamsButton.click();
    await expect.poll(() => this.page.context().pages().length).toBeGreaterThan(pagesBeforeClick.length);

    const newPages = this.page.context().pages().filter((page) => !pagesBeforeClick.includes(page));
    await Promise.all(newPages.map((page) => page.waitForLoadState('domcontentloaded')));

    const diary = newPages.find((page) => page.url().includes('dreams-diary.html'));
    const total = newPages.find((page) => page.url().includes('dreams-total.html'));
    if (!diary || !total) {
      throw new Error(`Expected diary and total pages, got: ${newPages.map((page) => page.url()).join(', ')}`);
    }

    return { diary, total };
  }
}