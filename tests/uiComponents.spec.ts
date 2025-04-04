import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:4200/");

});

test.describe('form layouts page', () => {
  test.beforeEach(async ({ page }) => {
    await page.getByText('Forms').click();
    await page.getByText('Form Layouts').click();
    await page.waitForURL('**/forms/layouts');
  })

  test('input fields', async ({ page }) => {
    const usingTheGridEmailInput = page.locator("nb-card", {hasText: "Using the Grid"}).getByRole('textbox', { name: "Email" });

    await usingTheGridEmailInput.fill("mail@mail.com");
    await usingTheGridEmailInput.clear();
    await usingTheGridEmailInput.pressSequentially("mail2@mail.com", {delay: 300});

    //generic assertion
    const inputValue = await usingTheGridEmailInput.inputValue();
    expect(inputValue).toEqual('mail2@mail.com');

    //locator assertion
    await expect(usingTheGridEmailInput).toHaveValue('mail2@mail.com');
  })

  test('Radio button', async ({ page }) => {
    const usingTheGridRadioButton = page.locator("nb-card", {hasText: "Using the Grid"})
   
    await usingTheGridRadioButton.getByLabel('Option 1').check({force: true});
    const radioStatus = await usingTheGridRadioButton.getByRole('radio', {name: "Option 1"}).isChecked();
    expect(radioStatus).toBeTruthy();
    await expect(usingTheGridRadioButton.getByRole('radio', {name: "Option 1"})).toBeChecked();

    // await usingTheGridRadioButton.getByLabel('Option 2').check({force: true});
    // await expect(usingTheGridRadioButton.getByRole('radio', {name: "Option 1"})).not.toBeFalsy();
    // await expect(usingTheGridRadioButton.getByRole('radio', {name: "Option 2"})).not.toBeTruthy();
    
  })

})