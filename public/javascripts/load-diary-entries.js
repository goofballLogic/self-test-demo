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
    const json = await resp.json();
    const template = document.querySelector("template#diary-entry");
    if (!template) throw new Error("Missing template");

    json.sort((a, b) => a.when > b.when ? -1 : a.when < b.when ? 1 : 0);

    diaryEntries.innerHTML = "";
    for (let entry of json) {
        const article = template.content.cloneNode(true);
        const timeElement = article.querySelector("time");
        timeElement.setAttribute("datetime", entry.when);
        timeElement.textContent = formatDiaryWhen(entry.when);
        const bodyElement = article.querySelector(".body");
        bodyElement.textContent = entry.text;
        diaryEntries.appendChild(article);
    }

}

loadDiaryEntries();
document.addEventListener("reload-app", loadDiaryEntries);