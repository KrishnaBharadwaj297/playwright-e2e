import { BasePage } from './BasePage';
import { ICustomWorld } from '../support/CustomWorld';
import { Logger } from '../utils/Logger';

export class FormPage extends BasePage {
    constructor(world: ICustomWorld) {
        super(world);
    }

    async triggerAlert() {
        // Handle dialog before action
        this.page.once('dialog', async (dialog) => {
            Logger.info(`Dialog detected: ${dialog.message()}`);
            await dialog.accept();
        });
        await this.clickElement('#alert-btn');
    }

    async submitGenericForm(name: string, email: string) {
        await this.fillText('#name', name);
        await this.fillText('#email', email);
        await this.clickElement('#submit');
    }
}
