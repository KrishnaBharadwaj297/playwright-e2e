import { When, Then, Given } from '@cucumber/cucumber';
import { ICustomWorld } from '../support/CustomWorld';
import { expect, APIResponse } from '@playwright/test';
import { Logger } from '../utils/Logger';

let response: APIResponse;

Given('I send a GET request to {string}', async function (this: ICustomWorld, url: string) {
    if (!this.api) throw new Error('API Request Context not initialized');
    Logger.info(`Sending GET request to: ${url}`);
    response = await this.api.get(url);
    Logger.info(`Response Status: ${response.status()}`);
});

When('I send a POST request to {string} with body:', async function (this: ICustomWorld, url: string, body: string) {
    if (!this.api) throw new Error('API Request Context not initialized');
    Logger.info(`Sending POST request to: ${url}`);
    response = await this.api.post(url, {
        data: JSON.parse(body)
    });
    Logger.info(`Response Status: ${response.status()}`);
});

Then('the response status should be {int}', async function (this: ICustomWorld, statusCode: number) {
    expect(response.status()).toBe(statusCode);
});

Then('the response should contain {string}', async function (this: ICustomWorld, key: string) {
    const responseBody = await response.json();
    Logger.info(`Response Body contains key: ${key}`);
    expect(responseBody).toHaveProperty(key);
});
