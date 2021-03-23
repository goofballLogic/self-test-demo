Feature: Branding of the app
    As a user
    I want to be able to recognise the app by its branding
    So that I can shift into the right mental model for using it

    Background: Load the app
        Given I have loaded the app

    Scenario: Textual elements
        Then the title of the app should be "My diary"
        And the main heading should be "My diary"

    Scenario: Styling
        Then the background colour should be "light beige"
        And the text colour should be "dark slate grey"
