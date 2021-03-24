import expect from "../../expect.js";

export function verifyFocusedAreaIsEditable() {
    const activeElement = document.activeElement;
    expect(activeElement.contentEditable).to.be("true");
}

export function verifyCurrentDateDisplayedBesideEditableArea() {
    const activeElement = document.activeElement;
    expect(activeElement.contentEditable).to.be("true");
    const time = activeElement.parentElement.querySelector("time");
    const dateFormat = new Intl.DateTimeFormat("default", { month: "long", day: "numeric", year: "numeric" });
    const parts = Object.fromEntries(dateFormat.formatToParts(new Date()).map(x => [x.type, x.value]));
    console.log(parts);
    const expected = `${parts.month} ${parts.day}, ${parts.year}`;
    expect(time.textContent).to.be(expected)
}