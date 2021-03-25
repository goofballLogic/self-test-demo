Feature: Application branding
    As Doogie
    I want to be bathed in the familiar blue glow of my IBM CRT monitor and text editor
    So that I can shift into the right mental model for an uplifting closing diary entry

    Background: Load the app
        Given I have loaded the app

    Scenario: Styling
        Then the background colour should be "bright blue"
        And the text colour should be "white"

    Scenario: Textual elements
        Then the title and heading should be "Personal journal of Doogie Howser, M.D."
        And the title should have a "cyan" background colour, drop shadow and horizontal rule