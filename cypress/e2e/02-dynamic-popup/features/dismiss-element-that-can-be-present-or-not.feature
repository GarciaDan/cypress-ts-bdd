Feature: Element that can be present or not is dismissed
    Scenario: Popup button is clicked if it appears, but it's not clicked otherwise
        Given the user navigates to a page that may show a popup or not
        When the user waits for 3 seconds
        Then the modal popup is not present in the page