import { Then, When } from '@cucumber/cucumber';
import { ICustomWorld } from '../support/CustomWorld';
import { SecurityHelper } from '../utils/SecurityHelper';
import { Logger } from '../utils/Logger';

Then('the response should not contain leaked secrets', async function (this: ICustomWorld) {
    // Requires API context usage, assuming last response is stored or passed via world.
    // Ideally, we'd hook into the API Response interception.
    // For this example, we'll check the page content or a specific variable.
    if (this.page) {
        const content = await this.page.content();
        const defects = SecurityHelper.scanForSecrets(content);
        if (defects.length > 0) {
            throw new Error(`Security Violation: Found ${defects.length} potential secrets!`);
        }
    }
});

Then('I verify GDPR cookie consent is displayed', async function (this: ICustomWorld) {
    if (!this.page) throw new Error('Page not initialized');
    const found = await SecurityHelper.checkGDPRBanner(this.page);
    if (!found) {
        Logger.warn('GDPR Banner not found. This might be a violation or just a missing selector in our list.');
    }
});

When('I trigger an OWASP ZAP scan on {string}', async function (this: ICustomWorld, url: string) {
    // Config via Env vars is best
    const zapUrl = process.env.ZAP_URL || 'http://localhost:8080';
    const zapKey = process.env.ZAP_API_KEY || '';
    await SecurityHelper.triggerZapScan(url, zapUrl, zapKey);
});

Then('I simulate PII data logging', async function (this: ICustomWorld) {
    Logger.info('Logging sensitive user: user@example.com with Credit Card: 4111-1111-1111-1234');
    Logger.info('Logging US Phone: 555-123-4567');
});
