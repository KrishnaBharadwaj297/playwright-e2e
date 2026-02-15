import fs from 'fs-extra';
import path from 'path';
import { Logger } from './Logger';

interface RoiConfig {
    manualTimePerTestMinutes: number;
    testerHourlyRateUSD: number;
    cloudInfraCostPerMinuteUSD: number;
    bugLeakageCostUSD: number;
    bugDetectionCostUSD: number; // Cost to fix in dev
    currencySymbol: string;
}

const reportPath = path.join(process.cwd(), 'reports', 'cucumber-report.json');
const configPath = path.join(process.cwd(), 'roi-config.json');
const outputPath = path.join(process.cwd(), 'reports', 'roi_dashboard.html');

const generateRoiReport = async () => {
    Logger.info('Generating ROI & Cost Analysis Report...');

    if (!fs.existsSync(reportPath)) {
        Logger.error('Cucumber report found! Run tests first.');
        return;
    }

    const report = await fs.readJson(reportPath);
    const config: RoiConfig = await fs.readJson(configPath);

    let totalTests = 0;
    let failedTests = 0;
    let totalDurationNano = 0;

    report.forEach((feature: any) => {
        feature.elements.forEach((scenario: any) => {
            totalTests++;
            let scenarioFailed = false;
            scenario.steps.forEach((step: any) => {
                if (step.result.duration) totalDurationNano += step.result.duration;
                if (step.result.status === 'failed') scenarioFailed = true;
            });
            if (scenarioFailed) failedTests++;
        });
    });

    // Calculations
    const totalDurationMinutes = totalDurationNano / 1000000000 / 60;
    const manualEffortMinutes = totalTests * config.manualTimePerTestMinutes;
    const timeSavedMinutes = manualEffortMinutes - totalDurationMinutes;

    const infraCost = totalDurationMinutes * config.cloudInfraCostPerMinuteUSD;
    const manualCost = (manualEffortMinutes / 60) * config.testerHourlyRateUSD;

    // Net Savings = (Cost to run manually) - (Infra Cost)
    // Note: This simplifies by ignoring script development time, focusing on execution ROI.
    const netSavings = manualCost - infraCost;

    // Bug ROI: Value of catching bugs early = (Prod Fix Cost - Dev Fix Cost) * Bugs Found
    const bugPreventionValue = failedTests * (config.bugLeakageCostUSD - config.bugDetectionCostUSD);

    const totalROI = netSavings + bugPreventionValue;
    const efficiencyImprovement = (manualEffortMinutes / totalDurationMinutes) * 100;

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Automation ROI Dashboard</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f4f6f9; padding: 20px; }
            .container { max-width: 1000px; margin: 0 auto; }
            .card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); margin-bottom: 20px; }
            h1 { color: #333; }
            .metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
            .metric { text-align: center; }
            .metric h3 { margin: 0; color: #777; font-size: 14px; text-transform: uppercase; }
            .metric p { font-size: 24px; font-weight: bold; color: #2c3e50; margin: 10px 0; }
            .positive { color: #27ae60 !important; }
            .negative { color: #c0392b !important; }
            .chart-container { height: 300px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>💰 Automation ROI & Cost Analysis</h1>
            
            <div class="card">
                <div class="metrics-grid">
                    <div class="metric">
                        <h3>Total Savings</h3>
                        <p class="positive">${config.currencySymbol}${totalROI.toFixed(2)}</p>
                    </div>
                    <div class="metric">
                        <h3>Time Saved</h3>
                        <p>${(timeSavedMinutes / 60).toFixed(1)} hrs</p>
                    </div>
                    <div class="metric">
                        <h3>Efficiency Gain</h3>
                        <p class="positive">${efficiencyImprovement.toFixed(0)}% Faster</p>
                    </div>
                    <div class="metric">
                        <h3>Infrastructure Cost</h3>
                        <p class="negative">${config.currencySymbol}${infraCost.toFixed(4)}</p>
                    </div>
                     <div class="metric">
                        <h3>Manual Cost Equivalent</h3>
                        <p>${config.currencySymbol}${manualCost.toFixed(2)}</p>
                    </div>
                    <div class="metric">
                        <h3>Bug Prevention Value</h3>
                        <p class="positive">${config.currencySymbol}${bugPreventionValue.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            <div class="grid-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div class="card">
                    <h3>Cost Comparison</h3>
                    <div class="chart-container"><canvas id="costChart"></canvas></div>
                </div>
                <div class="card">
                    <h3>Time Comparison (Minutes)</h3>
                    <div class="chart-container"><canvas id="timeChart"></canvas></div>
                </div>
            </div>
        </div>

        <script>
            const costCtx = document.getElementById('costChart').getContext('2d');
            new Chart(costCtx, {
                type: 'bar',
                data: {
                    labels: ['Manual Execution', 'Automation Infra'],
                    datasets: [{
                        label: 'Cost (USD)',
                        data: [${manualCost.toFixed(2)}, ${infraCost.toFixed(4)}],
                        backgroundColor: ['#e74c3c', '#2ecc71']
                    }]
                }
            });

            const timeCtx = document.getElementById('timeChart').getContext('2d');
            new Chart(timeCtx, {
                type: 'pie',
                data: {
                    labels: ['Manual Effort', 'Automation Runtime'],
                    datasets: [{
                        data: [${manualEffortMinutes.toFixed(2)}, ${totalDurationMinutes.toFixed(2)}],
                        backgroundColor: ['#f1c40f', '#3498db']
                    }]
                }
            });
        </script>
    </body>
    </html>
    `;

    await fs.writeFile(outputPath, htmlContent);
    Logger.info(`ROI Report generated: ${outputPath}`);
};

generateRoiReport();
