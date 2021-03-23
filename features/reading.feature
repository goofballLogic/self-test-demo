Feature: Reading diary entries
    As a user
    I want to be able to see my diary entries
    So that I can review what I have written and feel at home in the context of my previous thoughts



    Scenario: The latest entry should be shown at the top
        Given a test entry exists dated a year into the future
            """
            This is a test entry:
            Here's the first entry in my diary. It's super interesting!
            """
        And I have loaded the app
        Then the test entry should be displayed as the first item on the page