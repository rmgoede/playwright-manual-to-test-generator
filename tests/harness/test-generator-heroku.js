import { generatePlaywrightSchemaFromSteps } from "./generator.js";
import { renderPlaywrightTestFromSchema } from "./renderer.js";

const steps = `
1. Go to https://the-internet.herokuapp.com/login
2. Enter username tomsmith
3. Enter password SuperSecretPassword!
4. Click Login
5. Verify secure area page displayed
`;

const snapshotPaths = [
  "./snapshots/heroku-login.html"
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