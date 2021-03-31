Feature: motorrijtuigenbelasting

  Scenario: motorrijtuigenbelasting
    Given Navigate to the webpage
    When I am on the page
    And I provide the data for motor
    Then I should see the result of the amount of vehicle tax I should pay
