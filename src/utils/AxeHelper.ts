import { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { Logger } from './Logger';

export interface AccessibilityResult {
    score: number;
    violations: any[];
    suggestions: string[];
}

export class AxeHelper {
    static async checkAccessibility(page: Page, tags: string[] = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']): Promise<AccessibilityResult> {
        try {
            Logger.info(`Scanning accessibility with tags: ${tags.join(', ')}`);
            const accessibilityScanResults = await new AxeBuilder({ page })
                .withTags(tags)
                .analyze();

            const violations = accessibilityScanResults.violations;
            const score = this.calculateScore(violations);
            const suggestions = this.extractSuggestions(violations);

            if (violations.length > 0) {
                Logger.error(`Accessibility Scan Failed! Score: ${score}/100`);
                Logger.error(`Violations: ${violations.length}`);
                suggestions.forEach(s => Logger.info(`Suggestion: ${s}`));
            } else {
                Logger.info(`Accessibility Scan Passed! Score: ${score}/100`);
            }

            return {
                score,
                violations,
                suggestions
            };
        } catch (e) {
            Logger.error(`Error running accessibility check: ${e}`);
            throw e;
        }
    }

    private static calculateScore(violations: any[]): number {
        let penalty = 0;
        for (const violation of violations) {
            switch (violation.impact) {
                case 'critical': penalty += 5; break;
                case 'serious': penalty += 3; break;
                case 'moderate': penalty += 1; break;
                case 'minor': penalty += 0.5; break;
                default: penalty += 1;
            }
        }
        return Math.max(0, 100 - penalty);
    }

    private static extractSuggestions(violations: any[]): string[] {
        return violations.map(v => `[${v.id}] ${v.help} - Fix: ${v.helpUrl}`);
    }
}
