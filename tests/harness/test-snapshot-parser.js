import { parseSnapshot } from "./src/snapshot-parser.js";

const candidates = parseSnapshot("./snapshots/saucedemo.html");

console.log(JSON.stringify(candidates.slice(0, 20), null, 2));
console.log(`Total candidates: ${candidates.length}`);