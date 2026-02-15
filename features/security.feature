Feature: Security & Compliance Testing

  Scenario: PII Masking Verification
    Given I navigate to "https://www.saucedemo.com/"
    Then I simulate PII data logging

  Scenario: Secrets Detection
    Given I navigate to "https://www.saucedemo.com/"
    Then the response should not contain leaked secrets

  Scenario: GDPR Compliance Check
    Given I navigate to "https://www.theguardian.com/international"
    Then I verify GDPR cookie consent is displayed

  Scenario: OWASP ZAP Scan Trigger
    When I trigger an OWASP ZAP scan on "https://id.heroku.com/login"
