import { parseSnapshot } from "./src/snapshot-parser.js";
import { findBestMatch } from "./src/element-matcher.js";
import { resolveSelector } from "./src/selector-resolver.js";

const candidates = parseSnapshot("./snapshots/saucedemo.html");

const intent = "Login";

const match = findBestMatch(candidates, intent);
const selector = resolveSelector(match);

console.log("MATCH:");
console.log(match);

console.log("\nSELECTOR:");
console.log(selector);