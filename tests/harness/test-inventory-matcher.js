import { resolveLocatorFromSnapshot } from "./src/snapshot-selector-pipeline.js";

const snapshotPath = "./snapshots/saucedemo-inventory.html";

const intents = [
  "Add Backpack to cart",
  "Add Bike Light to cart",
  "Add Fleece Jacket to cart",
];

for (const intent of intents) {
  const result = resolveLocatorFromSnapshot(snapshotPath, intent);

  console.log("\nINTENT:", intent);
  console.log("MATCH:", result.match?.testId || result.match?.text || null);
  console.log("LOCATOR:", result.locator);
}