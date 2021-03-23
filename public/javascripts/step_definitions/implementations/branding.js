import expect from "../../expect.js";

export function verifyAppBackgroundColour(expected) {
    verifyKnownExpected(expected, "light beige");
    const computedStyle = window.getComputedStyle(document.body);
    expect(computedStyle.backgroundColor).to.be("rgb(202, 192, 174)");
}

export function verifyAppFontColour(expected) {
    verifyKnownExpected(expected, "dark slate grey");
    const computedStyle = window.getComputedStyle(document.body);
    expect(computedStyle.color).to.be("rgb(55, 65, 64)");
}

function verifyKnownExpected(expected, known) {
    if (expected !== known)
        throw new Error(`Please update the assertion - I only know about ${known}`);
}
