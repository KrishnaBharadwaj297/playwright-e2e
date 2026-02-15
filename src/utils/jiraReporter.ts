import axios from 'axios';
import fs from 'fs-extra';

export const createJiraTicket = async () => {
    const baseUrl = process.env.JIRA_BASE_URL;
    const email = process.env.JIRA_USER_EMAIL;
    const apiToken = process.env.JIRA_API_TOKEN;
    const projectKey = process.env.JIRA_PROJECT_KEY;

    if (!baseUrl || !email || !apiToken || !projectKey) {
        console.log('Skipping Jira integration: Missing configuration variables.');
        return;
    }

    try {
        const reportPath = 'reports/cucumber-report.json';
        if (!fs.existsSync(reportPath)) {
            console.error('Report file not found for Jira integration.');
            return;
        }

        const reportData = fs.readJsonSync(reportPath);
        const failures: string[] = [];

        reportData.forEach((feature: any) => {
            feature.elements.forEach((scenario: any) => {
                const steps = scenario.steps;
                const failedStep = steps.find((step: any) => step.result.status === 'failed');
                if (failedStep) {
                    failures.push(`Scenario: ${scenario.name}\nFeature: ${feature.name}\nError: ${failedStep.result.error_message?.substring(0, 200)}...`);
                }
            });
        });

        if (failures.length === 0) {
            console.log('No failures detected. Skipping Jira ticket creation.');
            return;
        }

        const summary = `Test Failures: ${new Date().toISOString()}`;
        const description = `The following scenarios failed during the test execution:\n\n${failures.join('\n\n')}`;

        const auth = Buffer.from(`${email}:${apiToken}`).toString('base64');

        const payload = {
            fields: {
                project: {
                    key: projectKey
                },
                summary: summary,
                description: description,
                issuetype: {
                    name: "Bug" // Ensure 'Bug' issue type exists in the project
                }
            }
        };

        const response = await axios.post(`${baseUrl}/rest/api/2/issue`, payload, {
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json'
            }
        });

        console.log(`Jira ticket created successfully: ${response.data.key} (${baseUrl}/browse/${response.data.key})`);

    } catch (error: any) {
        console.error('Failed to create Jira ticket:', error.response?.data || error.message);
    }
};
