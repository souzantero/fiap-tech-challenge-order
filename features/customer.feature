Feature: Customer
  In order to keep Customer api stable
  As a tester
  I want to make sure that everything works as expected

  Scenario: Get Customer By Document
    Given I make a GET request to /api/customers/document/12345678900
     When I receive a response
     Then I expect response should have a status 200
      And I expect response should have a json schema
      """
      {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid"
          },
          "createdAt": {
            "type": "string",
            "format": "date-time"
          },
          "updatedAt": {
            "type": "string",
            "format": "date-time"
          },
          "deletedAt": {
            "type": "null"
          },
          "name": {
            "type": "string"
          },
          "email": {
            "type": "string",
            "format": "email",
            "pattern": "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"
          },
          "document": {
            "type": "string",
            "pattern": "^[0-9]{11}$"
          }
        }
      }
      """