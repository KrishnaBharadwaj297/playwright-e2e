import { Before, After, BeforeAll, AfterAll, AfterStep, Status, setDefaultTimeout } from '@cucumber/cucumber';

setDefaultTimeout(60 * 1000);
import { chromium, firefox, webkit, Browser } from '@playwright/test';
import { CustomWorld } from './CustomWorld';
import { ICustomWorld } from './CustomWorld';
import fs from 'fs-extra';
import dotenv from 'dotenv';
dotenv.config();

let browser: Browser;

import { Logger } from '../utils/Logger';

BeforeAll(async function () {
    const browserName = process.env.BROWSER || 'chromium';
    Logger.info(`Starting Test Execution on: ${browserName}`);
    const launchOptions = {
        headless: process.env.HEADLESS !== 'false',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    };

    switch (browserName) {
        case 'firefox':
            browser = await firefox.launch(launchOptions);
            break;
        case 'webkit':
            browser = await webkit.launch(launchOptions);
            break;
        default:
            browser = await chromium.launch(launchOptions);
            break;
    }
});

Before(async function (this: ICustomWorld, scenario) {
    Logger.info(`----------------------------------------------------------------`);
    Logger.info(`Starting Scenario: ${scenario.pickle.name}`);
    this.startTime = new Date();
    await this.init(browser);
});

AfterStep(async function (this: ICustomWorld, scenario) {
    if (scenario.result?.status === Status.FAILED) {
        Logger.error(`Step Failed: ${scenario.pickle.name}`);
        if (this.page) {
            const screenshotPath = `reports/screenshots/${scenario.pickle.name.replace(/\s+/g, '_')}_failed.png`;
            const buffer = await this.page.screenshot({
                path: screenshotPath,
                fullPage: true
            });
            this.attach(buffer, "image/png");
            Logger.error(`Screenshot saved to: ${screenshotPath}`);
        }
    }
});

After(async function (this: ICustomWorld, scenario) {
    Logger.info(`Scenario Finished: ${scenario.pickle.name} [${scenario.result?.status?.toUpperCase()}]`);
    await this.cleanup();
});

AfterAll(async function () {
    Logger.info(`Test Execution Completed`);
    await browser.close();
});
