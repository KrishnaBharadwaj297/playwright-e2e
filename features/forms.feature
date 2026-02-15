Feature: Form Elements and Validation

  Scenario: Interact with UI Elements
    Given I navigate to "https://the-internet.herokuapp.com/checkboxes"
    When I click "form#checkboxes input:first-child"
    Then I wait for 1 seconds

  Scenario: Handle JavaScript Alert
    Given I navigate to "https://the-internet.herokuapp.com/javascript_alerts"
    When I click the element containing text "Click for JS Alert"
    Then I should see text "You successfully clicked an alert"
