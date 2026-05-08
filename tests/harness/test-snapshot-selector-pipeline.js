import { resolveLocatorFromSnapshot } from "./src/snapshot-selector-pipeline.js";

const snapshotPath = "./snapshots/saucedemo.html";

const intents = [
  "Username",
  "Password",
  "Login",
  "Does Not Exist",
];

for (const intent of intents) {
  const result = resolveLocatorFromSnapshot(snapshotPath, intent);

  console.log("\nINTENT:", intent);
  console.log("SELECTOR:", result.selector);
  console.log("LOCATOR:", result.locator);
}