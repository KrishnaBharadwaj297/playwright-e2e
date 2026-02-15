import reporter from 'cucumber-html-reporter';

const options: reporter.Options = {
    theme: 'bootstrap',
    jsonFile: 'reports/cucumber-report.json',
    output: 'reports/cucumber_report.html',
    reportSuiteAsScenarios: true,
    scenarioTimestamp: true,
    launchReport: false,
    metadata: {
        "App Version": "1.0.0",
        "Test Environment": "STAGING",
        "Browser": "Chrome/Playwright",
        "Platform": "GitLab CI",
        "Parallel": "Scenarios",
        "Executed": "Remote"
    }
};

try {
    reporter.generate(options);
    console.log('HTML Report generated successfully!');
} catch (err) {
    console.error('Failed to generate HTML report', err);
}
