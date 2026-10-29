import { expect, test } from '@playwright/test';
import { DreamPortalHomePage } from './pages/DreamPortalHomePage';

test.describe('Dream Portal Home', () => {
  test('TC-01 Loading animation appears on page load', async ({ page }) => {
    const home = new DreamPortalHomePage(page);
    await home.open();
    await home.expectLoadingState();
  });

  test('TC-02 Loading animation disappears after ~3 seconds', async ({ page }) => {
    const home = new DreamPortalHomePage(page);
    await home.open();
    await home.expectLoadingState();
    await home.expectLoadedState();
  });

  test('TC-03 Main portal content becomes visible after loading', async ({ page }) => {
    const home = new DreamPortalHomePage(page);
    await home.open();
    await home.expectLoadedState();
    await expect(page.getByRole('heading', { name: 'Dream Portal' })).toBeVisible();
  });

  test('TC-04 My Dreams button is visible and enabled', async ({ page }) => {
    const home = new DreamPortalHomePage(page);
    await home.open();
    await home.expectLoadedState();
    await expect(home.myDreamsButton).toBeVisible();
    await expect(home.myDreamsButton).toBeEnabled();
  });

  test('TC-05 Clicking My Dreams opens dreams-diary.html and dreams-total.html in new tabs', async ({ page }) => {
    const home = new DreamPortalHomePage(page);
    await home.open();
    await home.expectLoadedState();

    const { diary, total } = await home.openDreamPages();
    await expect(diary).toHaveTitle('Dreams Diary');
    await expect(total).toHaveTitle('Dreams Total');
  });
});
