import { Page } from '@playwright/test';
import { ICustomWorld } from '../support/CustomWorld';
import { Logger } from '../utils/Logger';

export class BasePage {
    protected page: Page;
    protected world: ICustomWorld;

    constructor(world: ICustomWorld) {
        this.world = world;
        if (!world.page) {
            throw new Error('Page is not initialized in the world');
        }
        this.page = world.page;
    }

    protected async navigateTo(url: string) {
        Logger.info(`Navigating to: ${url}`);
        await this.page.goto(url);
    }

    protected async clickElement(selector: string) {
        Logger.info(`Clicking element: ${selector}`);
        await this.page.click(selector);
    }

    protected async fillText(selector: string, text: string) {
        Logger.info(`Filling text: "${text}" into ${selector}`);
        await this.page.fill(selector, text);
    }

    protected async getElementText(selector: string): Promise<string> {
        const text = await this.page.innerText(selector);
        Logger.info(`Retrieved text from ${selector}: "${text}"`);
        return text;
    }

    protected async isElementVisible(selector: string): Promise<boolean> {
        return await this.page.isVisible(selector);
    }

    protected async pause(ms: number) {
        await this.page.waitForTimeout(ms);
    }

    protected async pressKey(key: string) {
        await this.page.keyboard.press(key);
    }

    protected async waitForSelector(selector: string) {
        await this.page.waitForSelector(selector);
    }
}
