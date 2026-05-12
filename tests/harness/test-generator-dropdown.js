import { generatePlaywrightSchemaFromSteps } from "../../generator.js";
import { renderPlaywrightTestFromSchema } from "../../renderer.js";

const steps = `
1. Go to https://the-internet.herokuapp.com/dropdown
2. Select Option 1 from the dropdown
3. Verify Option 1 is selected
`;

const snapshotPaths = [
  "./snapshots/heroku-dropdown.html"
];

try {
  const schemaJson = await generatePlaywrightSchemaFromSteps(
    steps,
    snapshotPaths
  );

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