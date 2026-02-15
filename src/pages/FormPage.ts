import { BasePage } from './BasePage';
import { ICustomWorld } from '../support/CustomWorld';
import { Logger } from '../utils/Logger';

export class FormPage extends BasePage {
    private readonly locators = {
        alertButton: '#alert-btn',
        nameInput: '#name',
        emailInput: '#email',
        submitButton: '#submit'
    };

    constructor(world: ICustomWorld) {
        super(world);
    }

    async triggerAlert() {
        // Handle dialog before action
        this.page.once('dialog', async (dialog) => {
            Logger.info(`Dialog detected: ${dialog.message()}`);
            await dialog.accept();
        });
        await this.clickElement(this.locators.alertButton);
    }

    async submitGenericForm(name: string, email: string) {
        await this.fillText(this.locators.nameInput, name);
        await this.fillText(this.locators.emailInput, email);
        await this.clickElement(this.locators.submitButton);
    }
}
