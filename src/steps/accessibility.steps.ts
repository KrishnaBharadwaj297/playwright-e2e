import { Then } from '@cucumber/cucumber';
import { ICustomWorld } from '../support/CustomWorld';
import { AxeHelper } from '../utils/AxeHelper';

import { Logger } from '../utils/Logger';

Then('The page accessibility score should be above {int}', async function (this: ICustomWorld, minScore: number) {
    if (!this.page) throw new Error('Page not initialized');
    const result = await AxeHelper.checkAccessibility(this.page);

    // Attach detailed report
    this.attach(JSON.stringify(result, null, 2), 'application/json');

    Logger.info(`Audit Score: ${result.score} (Required: ${minScore})`);

    if (result.score < minScore) {
        throw new Error(
            `Accessibility Score ${result.score} is below threshold ${minScore}. Check logs for fix suggestions.`
        );
    }
});

Then('I scan accessibility for WCAG 2.1 compliance', async function (this: ICustomWorld) {
    if (!this.page) throw new Error('Page not initialized');
    const result = await AxeHelper.checkAccessibility(this.page, ['wcag21a', 'wcag21aa']);

    if (result.violations.length > 0) {
        Logger.warn(`Accessibility violations found: ${result.violations.length}`);
    }
});
