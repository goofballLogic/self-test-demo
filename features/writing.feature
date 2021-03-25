Feature: Writing a diary entry
    As Doogie
    I want to be able to write a new entry in my diary
    So that I can round off an episode with an uplifting thought

    Background: Load the app and start editing
        Given I have loaded the app
        And I press the space bar

    Scenario: I should be able to press space bar to start writing
        Then my cursor should be focused in an editable area
        And the current date should be displayed beside the editable area

    Scenario: I should be able to tab out of the editable area to finish writing
        When I press the tab key
        Then there should no longer be any editable areas
        And the diary entry i just created should be saved to the database