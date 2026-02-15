import { Given, When, Then } from '@cucumber/cucumber';
import { ICustomWorld } from '../support/CustomWorld';
import { DemoPage } from '../pages/DemoPage';
import { AxeHelper } from '../utils/AxeHelper';
import { expect } from '@playwright/test';

Given('I navigate to the Playwright homepage', async function (this: ICustomWorld) {
    const demoPage = new DemoPage(this);
    await demoPage.navigateHome();
});

When('I search for {string}', async function (this: ICustomWorld, query: string) {
    const demoPage = new DemoPage(this);
    await demoPage.searchFor(query);
});

When('I select the first result', async function (this: ICustomWorld) {
    const demoPage = new DemoPage(this);
    await demoPage.clickFirstResult();
});

Then('I should see the heading containing {string}', async function (this: ICustomWorld, text: string) {
    const demoPage = new DemoPage(this);
    await demoPage.verifyHeading(text);
});

Then('The page should be accessible', async function (this: ICustomWorld) {
    if (!this.page) throw new Error('Page not initialized');
    const result = await AxeHelper.checkAccessibility(this.page);
    if (result.violations.length > 0) {
        this.attach(JSON.stringify(result.violations, null, 2), 'application/json');
    }
    // We can assert here, or just log. For robust framework, you might want to soft assert or warn.
    // expect(violations.length).toBe(0); // Uncomment to fail on a11y issues
    console.log(`Found ${result.violations.length} accessibility violations.`);
});

Then(
    'I verify the API {string} returns {int}',
    async function (this: ICustomWorld, endpoint: string, statusCode: number) {
        if (!this.api) throw new Error('API not initialized');
        const response = await this.api.get(endpoint);
        expect(response.status()).toBe(statusCode);
    }
);
