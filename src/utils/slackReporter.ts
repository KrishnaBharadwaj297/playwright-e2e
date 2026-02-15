import axios from 'axios';
import fs from 'fs-extra';

export const sendSlackNotification = async () => {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;

    if (!webhookUrl) {
        console.log('Skipping Slack notification: SLACK_WEBHOOK_URL not set.');
        return;
    }

    try {
        const reportPath = 'reports/cucumber-report.json';
        if (!fs.existsSync(reportPath)) {
            console.error('Report file not found for Slack notification.');
            return;
        }

        const reportData = fs.readJsonSync(reportPath);

        let passed = 0;
        let failed = 0;
        let skipped = 0;

        reportData.forEach((feature: any) => {
            feature.elements.forEach((scenario: any) => {
                const steps = scenario.steps;
                const isFailed = steps.some((step: any) => step.result.status === 'failed');
                const isSkipped = steps.some((step: any) => step.result.status === 'skipped');

                if (isFailed) failed++;
                else if (isSkipped) skipped++;
                else passed++;
            });
        });

        const total = passed + failed + skipped;
        const color = failed > 0 ? '#FF0000' : '#36a64f';
        const statusText = failed > 0 ? 'FAILED' : 'PASSED';

        const payload = {
            attachments: [
                {
                    color: color,
                    pretext: `*Test Execution Report* - ${statusText}`,
                    fields: [
                        { title: 'Total Scenarios', value: total, short: true },
                        { title: 'Passed', value: passed, short: true },
                        { title: 'Failed', value: failed, short: true },
                        { title: 'Skipped', value: skipped, short: true }
                    ],
                    footer: 'Playwright Automation Framework',
                    ts: Math.floor(Date.now() / 1000)
                }
            ]
        };

        await axios.post(webhookUrl, payload);
        console.log('Slack notification sent successfully.');

    } catch (error) {
        console.error('Failed to send Slack notification:', error);
    }
};
