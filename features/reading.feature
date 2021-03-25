Feature: Reading diary entries
    As Doogie
    I want to be able to review my previous diary entries in reverse chronological order
    So that I can scan my recent thoughts easily

    Scenario: The latest entry should be shown at the top
        Given a test entry exists dated 1 month into the future
            """
            Raymond and I have a lot in common.
            We both have to face prejudice for what we are...
            The difference is I won't be 17 forever.
            """
        And a test entry exists dated 2 months into the future
            """
            Getting away with a lie may be a good
            magic trick...but honesty works wonders.  Vinnie and I
            started out in opposite directions and ended up at the
            same place:  the truth.
            """
        And I have loaded the app
        Then the latest test entry should be displayed as the first diary entry
        And the diary entry should be formatted respecting line breaks