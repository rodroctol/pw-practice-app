import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:4200/");

  // Clica no menu Forms para expandir
  await page.getByText('Forms').click();

  // Clica em Form Layouts
  await page.getByText('Form Layouts').click();

  // Aguarda a URL da tela correta
  await page.waitForURL('**/forms/layouts');

  // Aguarda algum elemento da página aparecer
  await page.getByText('Using the Grid').waitFor();
});

test('Locator syntax rules', async ({ page }) => {
  //by tag name
  page.locator('input');

  //by ID
  page.locator('#inputEmail');

  //By attribute
  page.locator('[placeholder="Email"]');

  //By class value
  page.locator('.shape-rectangle');

  //Class Value (full)
  page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]');

  //combine different selectors
  page.locator('input[placeholder="Email"].shape-rectangle');

  //xPath (not reccomended)
  page.locator('//*[@id="inputEmail1"]');

  //by partial text
  page.locator(':text("Using")');

  //by full text
  page.locator(':text-is("Using the Grid")');
});

test('User facing locators', async ({ page }) => {
    await page.getByRole('textbox', {name:"Email"}).first().click();
    await page.getByRole('button', {name:"Sign in"}).first().click();

    await page.getByLabel('Email').first().click();

    await page.getByPlaceholder('Jane Doe').click();

    await page.getByText('Using the Grid').click();

    await page.getByTitle('Iot Dashboard').click();
})

test('Finding child elements', async ({ page }) => {
    await page.locator('nb-card nb-radio', { hasText: 'Option 1' }).click();
    await page.locator('nb-card nb-radio', { hasText: 'Option 2' }).click();
    await page.locator('nb-card').getByRole('button', {name: "Sign in"}).first().click();
});

test('Using parent elements', async ({ page }) => {
    await page.locator('nb-card', { hasText: 'Using the Grid' }).getByRole('textbox', {name: "Email"}).click();
    await page.locator('nb-card', { has: page.locator('#inputEmail1')}).getByRole('textbox', {name: "Email"}).click();

    await page.locator('nb-card').filter({hasText: 'Basic form'}).getByRole('textbox', {name: "Email"}).click();
    await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox', {name: "Password"}).click();

    await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: "Sign in"})
    .getByRole('textbox', {name: "Email"}).click();
})

test('Reusing locators', async ({ page }) => {
  const basicForm = page.locator('nb-card', { hasText: 'Basic form' });
  const emailField = basicForm.getByRole('textbox', {name: "Email"});

  await emailField.fill('testEmail@mail.com');
  await basicForm.getByRole('textbox', {name: "Password"}).fill('Test123');
  await basicForm.locator('nb-checkbox').click();
  await basicForm.getByRole('button').click();
  
  await expect(emailField).toHaveValue('testEmail@mail.com');
})

test('extracting values', async ({ page }) => {
  const basicForm = page.locator('nb-card', { hasText: 'Basic form' });
  const buttonText = await basicForm.locator('button').textContent();
  expect(buttonText).toEqual('Submit');

  const allRadioButtonsLabels = await page.locator('nb-radio').allTextContents();
  expect(allRadioButtonsLabels).toContain('Option 1');

  const emailField = basicForm.getByRole('textbox', {name: "Email"});
  await emailField.fill('testEmail@mail.com');
  const emailValue = await emailField.inputValue()
  expect(emailValue).toEqual('testEmail@mail.com');

  const placeholderValue = await emailField.getAttribute('placeholder');
  expect(placeholderValue).toEqual('Email');
})

test('Assertions', async ({ page }) => {

  const basicFormButton = page.locator('nb-card').filter({hasText: 'Basic form'}).locator('button');

  //general assertion
  const value = 5;
  expect(value).toBe(5);

  const text = await basicFormButton.textContent();
  expect(text).toEqual('Submit');

  //Locator assertion
  await expect(basicFormButton).toHaveText('Submit');

  //sort assertion
  await expect.soft(basicFormButton).toHaveText('Submit');
})