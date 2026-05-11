import { generatePlaywrightSchemaFromSteps } from "../../generator.js";
import { renderPlaywrightTestFromSchema } from "../../renderer.js";

const steps = `
1. Go to https://the-internet.herokuapp.com/checkboxes
2. Check checkbox 1
3. Verify checkbox 1 is checked
`;

const snapshotPaths = [
  "./snapshots/heroku-checkboxes.html"
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