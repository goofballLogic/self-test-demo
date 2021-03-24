import { When } from "../bdd.js";

When("I do something else", () => console.log("I did something else"));

When("I also do {string}", x => console.log(`I also did: ${x}`))

When("I press the space bar", () => document.dispatchEvent(new KeyboardEvent('keydown', { 'keyCode': 32, 'which': 32 })));