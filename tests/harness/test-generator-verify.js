import { generatePlaywrightSchemaFromSteps } from "./generator.js";
import { renderPlaywrightTestFromSchema } from "./renderer.js";

const steps = `
1. Go to https://www.saucedemo.com
2. Enter username standard_user
3. Enter password secret_sauce
4. Click Login
5. Add Backpack to cart
6. Verify cart badge shows 1
`;

const snapshotPaths = [
  "./snapshots/saucedemo.html",
  "./snapshots/saucedemo-inventory.html"
];

try {
  const schemaJson = await generatePlaywrightSchemaFromSteps(steps, snapshotPaths);

  console.log("\nSCHEMA:");
  console.log(schemaJson);

  const schema = JSON.parse(schemaJson);
  const code = renderPlaywrightTestFromSchema(schema);

  console.log("\nCODE:");
  console.log(code);
} catch (err) {
  console.error("\nERROR:");
  console.error(err);
}