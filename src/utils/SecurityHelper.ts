import axios from 'axios';
import { Logger } from './Logger';
import { Page } from '@playwright/test';

export const SECURITY_CONFIG = {
    GDPR_SELECTORS: [
        '#onetrust-banner-sdk', // OneTrust
        '.cookie-banner', // Generic
        '#cookie-banner',
        '[aria-label="cookieconsent"]',
        'text=Accept Cookies',
        'text=We use cookies'
    ],
    SECRET_PATTERNS: [
        { name: 'AWS Access Key', regex: /(A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}/ },
        { name: 'Private Key', regex: /-----BEGIN PRIVATE KEY-----/ },
        { name: 'Generic API Key', regex: /api_key\s*[:=]\s*['"]?[a-zA-Z0-9]{20,}['"]?/i },
        { name: 'Bearer Token', regex: /Bearer\s+[a-zA-Z0-9\-._~+/]+=*/ }
    ]
};

export class SecurityHelper {
    /**
     * Scans text content for potential secrets (API Keys, AWS Keys, Private Keys)
     * @param content text to scan (e.g. API response body)
     */
    static scanForSecrets(content: string): string[] {
        const findings: string[] = [];
        SECURITY_CONFIG.SECRET_PATTERNS.forEach((p) => {
            if (p.regex.test(content)) {
                findings.push(`Potential ${p.name} found!`);
            }
        });

        if (findings.length > 0) {
            findings.forEach((f) => Logger.warn(`[SECURITY] ${f}`));
        } else {
            Logger.info('[SECURITY] No secrets detected in content.');
        }
        return findings;
    }

    /**
     * Checks if a GDPR-compliant cookie banner is visible using common selectors.
     * @param page Playwright Page
     */
    static async checkGDPRBanner(page: Page): Promise<boolean> {
        for (const selector of SECURITY_CONFIG.GDPR_SELECTORS) {
            if (await page.isVisible(selector).catch(() => false)) {
                Logger.info(`[SECURITY] GDPR Banner found: ${selector}`);
                return true;
            }
        }
        Logger.warn('[SECURITY] No common GDPR banner detected.');
        return false;
    }

    /**
     * Triggers an OWASP ZAP Scan for the given URL.
     * Requires ZAP execution (e.g. Docker or Daemon) with API Key.
     */
    static async triggerZapScan(
        targetUrl: string,
        zapApiUrl: string = 'http://localhost:8080',
        apiKey: string = ''
    ): Promise<void> {
        try {
            Logger.info(`[SECURITY] Triggering ZAP Spider for: ${targetUrl}`);
            // Start Spider
            const spiderResp = await axios.get(`${zapApiUrl}/JSON/spider/action/scan/`, {
                params: { url: targetUrl, apikey: apiKey }
            });
            const scanId = spiderResp.data.scan;
            Logger.info(`[SECURITY] ZAP Spider Started. ID: ${scanId}`);

            // Simple wait (In real world, poll status)
            await new Promise((r) => setTimeout(r, 5000));
            Logger.info('[SECURITY] ZAP Spider initiated successfully (Async). Check ZAP Dashboard for results.');
        } catch (error: any) {
            Logger.error(`[SECURITY] ZAP Connection Failed: ${error.message}. Is ZAP running?`);
            // Don't fail the test, just log error as infrastructure might be optional
        }
    }
}
