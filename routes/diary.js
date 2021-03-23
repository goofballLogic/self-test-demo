const db = require("./fake-db");

var express = require("express");
var router = express.Router();

/* GET diary entries */
router.get("/entries", function (req, res) {
    const entries = [...db.entries];
    console.log("DIARY ENTRIES", req.testContextId);
    if (req.testContextId) {
        const testEntry = db.testEntries && db.testEntries[req.testContextId];
        if (testEntry) entries.push(testEntry);
    }
    res.send(entries);
});

module.exports = router;
