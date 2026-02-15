Feature: E-Commerce Flow on SauceDemo
  As a customer
  I want to be able to browse products, add them to cart, and checkout
  So that I can purchase items successfully

  @ui @complex
  Scenario: End-to-End Purchase Flow
    Given I navigate to "https://www.saucedemo.com/"
    When I fill "[data-test='username']" with "standard_user"
    And I fill "[data-test='password']" with "secret_sauce"
    And I click "[data-test='login-button']"
    Then I should see text "Products"
    
    When I click "[data-test='add-to-cart-sauce-labs-backpack']"
    And I click "[data-test='add-to-cart-sauce-labs-bike-light']"
    Then I should see ".shopping_cart_badge" containing text "2"
    
    When I click ".shopping_cart_link"
    Then I should see text "Your Cart"
    And I should see text "Sauce Labs Backpack"
    And I should see text "Sauce Labs Bike Light"
    
    When I click "[data-test='checkout']"
    Then I should see text "Checkout: Your Information"
    
    When I fill "[data-test='firstName']" with "John"
    And I fill "[data-test='lastName']" with "Doe"
    And I fill "[data-test='postalCode']" with "12345"
    And I click "[data-test='continue']"
    Then I should see text "Checkout: Overview"
    
    When I click "[data-test='finish']"
    Then I should see text "Thank you for your order!"
    And I should see text "Your order has been dispatched"

  @ui @a11y
  Scenario: Login Page Accessibility
    Given I navigate to "https://www.saucedemo.com/"
    Then The page should be accessible
