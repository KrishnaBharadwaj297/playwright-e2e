import { Given, When, Then } from '@cucumber/cucumber';
import { ICustomWorld } from '../support/CustomWorld';
import { expect } from '@playwright/test';

// Navigation
Given('I navigate to {string}', async function (this: ICustomWorld, url: string) {
    await this.page?.goto(url);
});

// Click interactions
When('I click {string}', async function (this: ICustomWorld, selector: string) {
    if (!this.page) throw new Error("Page not initialized");
    await this.page.click(selector);
});

When('I click the element containing text {string}', async function (this: ICustomWorld, text: string) {
    if (!this.page) throw new Error("Page not initialized");
    await this.page.click(`text=${text}`);
});

// Form interactions
When('I fill {string} with {string}', async function (this: ICustomWorld, selector: string, value: string) {
    if (!this.page) throw new Error("Page not initialized");
    await this.page.fill(selector, value);
});

When('I select {string} from {string}', async function (this: ICustomWorld, option: string, selector: string) {
    if (!this.page) throw new Error("Page not initialized");
    await this.page.selectOption(selector, option);
});

// Validation
Then('I should see {string}', async function (this: ICustomWorld, selector: string) {
    if (!this.page) throw new Error("Page not initialized");
    await expect(this.page.locator(selector)).toBeVisible();
});

Then('I should see text {string}', async function (this: ICustomWorld, text: string) {
    if (!this.page) throw new Error("Page not initialized");
    await expect(this.page.locator(`text=${text}`)).toBeVisible();
});

Then('I should see {string} containing text {string}', async function (this: ICustomWorld, selector: string, text: string) {
    if (!this.page) throw new Error("Page not initialized");
    await expect(this.page.locator(selector)).toContainText(text);
});

Then('I wait for {int} seconds', async function (this: ICustomWorld, seconds: number) {
    await this.page?.waitForTimeout(seconds * 1000);
});
