import { Given } from "../bdd.js";
import { server } from "../remoting.js";
import { goHome } from "./implementations/navigation.js";

Given("I have loaded the app", goHome);

Given("a test entry exists dated a year into the future", server("add test entry"));