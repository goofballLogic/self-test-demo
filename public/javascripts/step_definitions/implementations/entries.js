import { standardFormatter } from "../../date-time-format.js";

const TIMEOUT = 5000;

async function select(selector, matcher) {
    const now = Date.now();
    let found = document.querySelector(selector);
    while (!found) {
        await new Promise(resolve => setTimeout(resolve, 100));
        if ((Date.now() - now) > TIMEOUT) throw new Error(`Timed out waiting for ${selector}`);
        found = document.querySelector(selector);
        if (matcher) found = matcher(found) && found;
    }
    return found;
}

export async function inspectFirstEntry() {

    const entry = await select("article.diary", x => x.textContent.includes("This is a test entry"));
    if (!entry) throw new Error("No entries found");
    return {
        when: entry.querySelector("time").dateTime,
        whenText: entry.querySelector("time").textContent,
        dateTimeOptions: standardFormatter.resolvedOptions(),
        text: entry.querySelector(".body").innerHTML
    };
}