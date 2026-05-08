import { parseSnapshot } from "./src/snapshot-parser.js";
import { findBestMatch } from "./src/element-matcher.js";
import { resolveSelector } from "./src/selector-resolver.js";
import { buildLocator } from "./src/locator-builder.js";

const candidates = parseSnapshot("./snapshots/saucedemo.html");

const intent = "Login";

const match = findBestMatch(candidates, intent);
const selector = resolveSelector(match);
const locator = buildLocator(selector);

console.log("LOCATOR:");
console.log(locator);