Feature: User is able to sign in the web application
    Scenario: User logs in successfully
        Given the user navigates to login page
        When the user provides valid credentials
        Then the main page is displayed to the authenticated user