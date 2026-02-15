Feature: API Testing

  Scenario: Verify GET Request
    When I send a GET request to "https://jsonplaceholder.typicode.com/posts/1"
    Then the response status should be 200
    And the response should contain "userId"

  Scenario: Verify POST Request
    When I send a POST request to "https://jsonplaceholder.typicode.com/posts" with body:
    """
    {
      "title": "foo",
      "body": "bar",
      "userId": 1
    }
    """
    Then the response status should be 201
    And the response should contain "id"
