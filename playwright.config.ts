import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './features',
    snapshotDir: './snapshots', // Centralized snapshots
    updateSnapshots: process.env.UPDATE_SNAPSHOTS === 'true' ? 'all' : 'missing',
    expect: {
        toHaveScreenshot: {
            maxDiffPixelRatio: 0.2,
            threshold: 0.2,     // Robustness against minor rendering diffs (AI-lite)
            animations: 'disabled',
        },
    },
    use: {
        screenshot: 'only-on-failure',
    },
});
