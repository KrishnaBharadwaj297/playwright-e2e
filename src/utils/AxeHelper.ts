import { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

export class AxeHelper {
    static async checkAccessibility(page: Page) {
        try {
            const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
            if (accessibilityScanResults.violations.length > 0) {
                console.error('Accessibility violations found:', accessibilityScanResults.violations);
                // Return violations for attachment to report
                return accessibilityScanResults.violations;
            }
            return [];
        } catch (e) {
            console.error('Error running accessibility check:', e);
            throw e;
        }
    }
}
