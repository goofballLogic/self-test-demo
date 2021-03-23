import { When } from "../bdd.js";

When("I do something else", () => console.log("I did something else"));

When("I also do {string}", x => console.log(`I also did: ${x}`))