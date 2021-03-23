import expect from "../../expect.js";

export function verifyAppBackgroundColour(expected) {
    verifyKnownExpected(expected, "bright blue");
    const computedStyle = window.getComputedStyle(document.body);
    expect(computedStyle.backgroundColor).to.be("rgb(0, 48, 255)");
}

export function verifyAppFontColour(expected) {
    verifyKnownExpected(expected, "white");
    const computedStyle = window.getComputedStyle(document.body);
    expect(computedStyle.color).to.be("rgb(255, 255, 255)");
}

function verifyKnownExpected(expected, known) {
    if (expected !== known)
        throw new Error(`Please update the assertion - I only know about ${known}`);
}
