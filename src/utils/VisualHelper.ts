import { Page, Locator } from '@playwright/test';
import { Logger } from './Logger';
import fs from 'fs-extra';
import path from 'path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

export class VisualHelper {
    private static snapshotDir = 'snapshots';

    static async verifyFullPage(page: Page, name: string, threshold: number = 0.2) {
        Logger.info(`Verifying full page visual snapshot: ${name}`);
        const snapshotPath = path.join(this.snapshotDir, `${name}.png`);
        const actualPath = path.join('reports', 'screenshots', `${name}_actual.png`);
        const diffPath = path.join('reports', 'screenshots', `${name}_diff.png`);

        await fs.ensureDir(path.dirname(snapshotPath));
        await fs.ensureDir(path.dirname(actualPath));

        // Take screenshot
        const screenshotBuffer = await page.screenshot({ fullPage: true });

        await this.compareSnapshots(screenshotBuffer, snapshotPath, actualPath, diffPath, threshold);
    }

    static async verifyComponent(page: Page, selector: string, name: string) {
        Logger.info(`Verifying component visual snapshot: ${selector} as ${name}`);
        const locator = page.locator(selector);
        await expect(locator).toBeVisible();

        const snapshotPath = path.join(this.snapshotDir, `${name}.png`);
        const actualPath = path.join('reports', 'screenshots', `${name}_actual.png`);
        const diffPath = path.join('reports', 'screenshots', `${name}_diff.png`);

        await fs.ensureDir(path.dirname(snapshotPath));
        await fs.ensureDir(path.dirname(actualPath));

        const screenshotBuffer = await locator.screenshot();

        await this.compareSnapshots(screenshotBuffer, snapshotPath, actualPath, diffPath, 0.1);
    }

    private static async compareSnapshots(
        actualBuffer: Buffer,
        expectedPath: string,
        actualPath: string,
        diffPath: string,
        threshold: number
    ) {
        if (!fs.existsSync(expectedPath) || process.env.UPDATE_SNAPSHOTS === 'true') {
            Logger.info(`Creating/Updating baseline for ${path.basename(expectedPath)}`);
            await fs.writeFile(expectedPath, actualBuffer);
            return;
        }

        const expectedBuffer = await fs.readFile(expectedPath);
        await fs.writeFile(actualPath, actualBuffer);

        const imgActual = PNG.sync.read(actualBuffer);
        const imgExpected = PNG.sync.read(expectedBuffer);

        if (imgActual.width !== imgExpected.width || imgActual.height !== imgExpected.height) {
            Logger.error(`Image dimensions do not match! Actual: ${imgActual.width}x${imgActual.height}, Expected: ${imgExpected.width}x${imgExpected.height}`);
            throw new Error('Image dimensions mismatch');
        }

        const diff = new PNG({ width: imgActual.width, height: imgActual.height });

        const numDiffPixels = pixelmatch(
            imgActual.data,
            imgExpected.data,
            diff.data,
            imgActual.width,
            imgActual.height,
            { threshold }
        );

        if (numDiffPixels > 0) {
            Logger.error(`Visual Mismatch! ${numDiffPixels} pixels differ.`);
            await fs.writeFile(diffPath, PNG.sync.write(diff));
            throw new Error(`Visual mismatch found! See ${diffPath}`);
        } else {
            Logger.info('Visual check passed!');
        }
    }
}

// Helper needed because 'expect' is used in verifyComponent for visibility check
import { expect } from '@playwright/test';
