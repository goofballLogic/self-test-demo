import { Then } from "../bdd.js";
import { server } from "../remoting.js";
import expect from "../expect.js";
import { verifyAppBackgroundColour, verifyAppFontColour } from "./implementations/branding.js";
import { inspectFirstEntry } from "./implementations/entries.js";

Then("the title of the app should be {string}", expected => expect(document.title).to.be(expected));

Then("the main heading should be {string}", expected => expect(document.querySelector("h1").textContent.trim()).to.be(expected));

Then("the background colour should be {string}", verifyAppBackgroundColour);

Then("the text colour should be {string}", verifyAppFontColour);

Then("the test entry should be displayed as the first item on the page", server("match added entry", inspectFirstEntry));