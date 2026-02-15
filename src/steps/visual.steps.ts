import { Then } from '@cucumber/cucumber';
import { ICustomWorld } from '../support/CustomWorld';
import { VisualHelper } from '../utils/VisualHelper';

Then('I verify the full page visual snapshot named {string}', async function (this: ICustomWorld, name: string) {
    if (!this.page) throw new Error('Page not initialized');
    // Normalize name for filesystem safety
    const safeName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    await VisualHelper.verifyFullPage(this.page, safeName);
});

Then(
    'I verify the visual snapshot of component {string} named {string}',
    async function (this: ICustomWorld, selector: string, name: string) {
        if (!this.page) throw new Error('Page not initialized');
        const safeName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        await VisualHelper.verifyComponent(this.page, selector, safeName);
    }
);

Then(
    'I verify the visual snapshot with {float} tolerance named {string}',
    async function (this: ICustomWorld, tolerance: number, name: string) {
        if (!this.page) throw new Error('Page not initialized');
        const safeName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        await VisualHelper.verifyFullPage(this.page, safeName, tolerance);
    }
);
