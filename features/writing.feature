Feature: Writing a diary entry
    As Doogie
    I want to be able to write a new entry in my diary
    So that I can round off an episode with an uplifting thought

    Scenario: I should be able to press space bar to start writing
        Given I have loaded the app
        When I press the space bar
        Then my cursor should be focused in an editable area
        And the current date should be displayed beside the editable area