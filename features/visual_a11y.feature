Feature: Advanced Visual and Accessibility Testing

  Scenario: Visual Regression Check
    Given I navigate to "https://www.saucedemo.com/"
    Then I verify the visual snapshot of component ".login_logo" named "login_logo"
    And I verify the full page visual snapshot named "login_page"

  Scenario: WCAG Compliance Audit
    Given I navigate to "https://www.saucedemo.com/"
    Then The page accessibility score should be above 90
    And I scan accessibility for WCAG 2.1 compliance
