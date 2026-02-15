module.exports = {
    default: {
        paths: ['features/**/*.feature'],
        requireModule: ['ts-node/register'],
        require: [
            'src/support/**/*.ts',
            'src/steps/**/*.ts'
        ],
        format: [
            'summary',
            'progress-bar',
            'html:reports/cucumber-html-report.html',
            'json:reports/cucumber-report.json',
            'allure-cucumberjs/reporter'
        ],
        formatOptions: {
            snippetInterface: 'async-await',
            resultsDir: 'reports/allure-results'
        },
        publishQuiet: true
    }
}
