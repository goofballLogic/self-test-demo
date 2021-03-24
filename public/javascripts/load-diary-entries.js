import el from "../WC/el.js";
import { standardFormatter } from "./date-time-format.js";

function formatDiaryWhen(when) {
    const parsed = Object.fromEntries(standardFormatter.formatToParts(new Date(when)).map(({ type, value }) => [type, value]));
    return `${parsed.month} ${parsed.day}, ${parsed.year}`;
}

async function loadDiaryEntries() {

    const diaryEntries = document.querySelector("#diary-entries");
    diaryEntries.innerHTML = "";

    const resp = await fetch("/diary/entries");
    if (!resp.ok) console.log(resp);
    if (!resp.ok) throw new Error("Failed to load diary entries from the server");
    const items = await resp.json();
    const template = document.querySelector("template#diary-entry");
    if (!template) throw new Error("Missing template");

    items.sort((a, b) => a.when > b.when ? -1 : a.when < b.when ? 1 : 0);

    diaryEntries.innerHTML = "";
    for (let item of items) {
        const entry = createNewEntry(template, item);
        diaryEntries.appendChild(entry);
    }

}

loadDiaryEntries();
document.addEventListener("reload-app", loadDiaryEntries);
document.addEventListener("keydown", maybeStartEditing);

let isEditing = false;

function createNewEntry(template, item) {
    const entry = template.content.cloneNode(true);
    const timeElement = entry.querySelector("time");
    timeElement.setAttribute("datetime", item.when);
    timeElement.textContent = formatDiaryWhen(item.when);
    const bodyElement = entry.querySelector(".body");
    bodyElement.textContent = item.text;
    return entry;
}

function maybeStartEditing(e) {
    if (isEditing) return;
    if (e.keyCode !== 32) return;

    const template = document.querySelector("template#diary-entry");
    if (!template) throw new Error("Missing template");
    const newEntry = createNewEntry(template, { when: new Date().toISOString(), text: "" });
    const body = newEntry.querySelector(".body");
    body.contentEditable = "true";

    const diaryEntries = document.querySelector("#diary-entries");
    if (diaryEntries.children.length)
        diaryEntries.insertBefore(newEntry, diaryEntries.children[0]);
    else
        diaryEntries.appendChild(newEntry);

    body.focus();
    body.addEventListener("blur", () => {
        isEditing = false
        body.contentEditable = "false";
    });

    isEditing = true;
}