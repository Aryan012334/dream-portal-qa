import { expect, Page } from '@playwright/test';

export class DreamPortalHomePage {
  readonly page: Page;
  readonly loadingMessage: ReturnType<Page['getByText']>;
  readonly spinner: ReturnType<Page['locator']>;
  readonly myDreamsButton: ReturnType<Page['getByRole']>;

  constructor(page: Page) {
    this.page = page;
    this.loadingMessage = page.getByText('Loading your dream portal...');
    this.spinner = page.locator('#loadingAnimation .spinner');
    this.myDreamsButton = page.getByRole('button', { name: 'My Dreams' });
  }

  async open(): Promise<void> {
    await this.page.goto('./');
  }

  async expectLoadingState(): Promise<void> {
    await expect(this.loadingMessage).toBeVisible();
    await expect(this.spinner).toBeVisible();
    await expect(this.spinner).toHaveCSS('animation-name', 'spin');
    await expect(this.myDreamsButton).toBeHidden();
  }

  async expectLoadedState(): Promise<void> {
    await expect(this.myDreamsButton).toBeVisible({ timeout: 5000 });
    await expect(this.loadingMessage).toBeHidden();
    await expect(this.page.getByRole('heading', { name: 'Dream Portal' })).toBeVisible();

    const elapsedSinceDomContentLoaded = await this.page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
      if (!navigation) {
        throw new Error('Navigation timing is unavailable');
      }
      return performance.now() - navigation.domContentLoadedEventEnd;
    });
    expect(elapsedSinceDomContentLoaded).toBeGreaterThanOrEqual(2500);
    expect(elapsedSinceDomContentLoaded).toBeLessThanOrEqual(4500);
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