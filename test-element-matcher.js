import { parseSnapshot } from "./src/snapshot-parser.js";
import { findBestMatch } from "./src/element-matcher.js";

const candidates = parseSnapshot("./snapshots/saucedemo.html");

// simulate LLM intent
const intent = "Login";

const match = findBestMatch(candidates, intent);

console.log("MATCH:");
console.log(match);