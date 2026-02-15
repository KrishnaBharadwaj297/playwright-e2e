import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, APIRequestContext, PlaywrightTestOptions } from '@playwright/test';

export interface ICustomWorld extends World {
    browser?: Browser;
    context?: BrowserContext;
    page?: Page;
    api?: APIRequestContext;
    debug: boolean;
    startTime: Date;
    playwrightOptions?: PlaywrightTestOptions;
    init(browser: Browser): Promise<void>;
    cleanup(): Promise<void>;
}

export class CustomWorld extends World implements ICustomWorld {
    constructor(options: IWorldOptions) {
        super(options);
        this.debug = false;
        this.startTime = new Date();
    }
    browser?: Browser;
    context?: BrowserContext;
    page?: Page;
    api?: APIRequestContext;
    debug: boolean;
    startTime: Date;
    playwrightOptions?: PlaywrightTestOptions;

    async init(browser: Browser) {
        this.browser = browser;
        this.context = await browser.newContext(this.playwrightOptions);
        this.page = await this.context.newPage();
        this.api = this.page.request;
    }

    async cleanup() {
        await this.page?.close();
        await this.context?.close();
    }
}

setWorldConstructor(CustomWorld);
