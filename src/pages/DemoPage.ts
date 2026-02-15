import { ICustomWorld } from '../support/CustomWorld';
import { BasePage } from './BasePage';
import { expect } from '@playwright/test';

export class DemoPage extends BasePage {
    constructor(world: ICustomWorld) {
        super(world);
    }

    async navigateHome() {
        await this.navigateTo('https://playwright.dev');
    }

    async searchFor(query: string) {
        // Playwright site specific selectors
        const searchButton = 'button.DocSearch-Button';
        await this.clickElement(searchButton);
        const searchInput = 'input.DocSearch-Input';
        await this.waitForSelector(searchInput);
        await this.fillText(searchInput, query);
    }

    async clickFirstResult() {
        // Just an example action, selecting first hit
        await this.page.keyboard.press('Enter');
    }

    async verifyHeading(text: string) {
        const heading = this.page.locator('h1');
        await expect(heading).toContainText(text);
    }
}
