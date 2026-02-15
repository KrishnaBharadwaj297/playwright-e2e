import { sendSlackNotification } from './slackReporter';
import { createJiraTicket } from './jiraReporter';
import dotenv from 'dotenv';
dotenv.config();

(async () => {
    console.log('Starting Notification Service...');

    // Execute independently
    await sendSlackNotification();
    await createJiraTicket();

    console.log('Notification Service Completed.');
})();
