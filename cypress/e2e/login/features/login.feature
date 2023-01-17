Feature: Login

    @login
    Scenario: User logs in the application
        Given the user navigates to login page
        When the user enters valid credentials
        Then the user is logged in