import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://uitestingplayground.com/ajax");
  await page.getByText('Button Triggering AJAX Request').click();
});

test('auto waiting', async ({ page }) => {
    await page.waitForResponse('http://uitestingplayground.com/ajaxdata');
    const successButton = page.locator('.bg-success');
    await expect(successButton).toHaveText('Data loaded with AJAX get request.', {timeout: 20000});
})