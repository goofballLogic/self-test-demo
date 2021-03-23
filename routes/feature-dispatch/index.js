const db = require("../fake-db");
const shortid = require("shortid");
const assert = require("assert");

const registry = {};

module.exports = function dispatch(description, context, params) {
    if (description in registry) {
        return registry[description].apply(context, params);
    } else {
        throw new Error(`Unknown step: ${description}`);
    }
}

registry["add test entry"] = function (text) {

    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const newEntry = {
        id: shortid(),
        text: text,
        when: nextYear
    };
    if (!db.testEntries) db.testEntries = {};
    db.testEntries[this.testContextId] = newEntry;
    this.addedEntryId = newEntry.id;

};

registry["match added entry"] = function (expected) {

    const { addedEntryId } = this;
    const { dateTimeOptions } = expected;

    const actual = db.testEntries && db.testEntries[this.testContextId];
    if (!actual) throw new Error("No test entry exists for this test context");
    if (actual.id !== addedEntryId) throw new Error("Unexpected test entry");

    const dateTimeFormatter = new Intl.DateTimeFormat(dateTimeOptions.locale, dateTimeOptions);

    assert.deepStrictEqual({
        when: expected.when,
        whenText: expected.whenText,
        text: expected.text
    }, {
        when: JSON.parse(JSON.stringify(actual.when)),
        whenText: dateTimeFormatter.format(actual.when),
        text: actual.text
    });
}