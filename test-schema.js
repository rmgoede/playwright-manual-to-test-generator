import { generatePlaywrightSchemaFromSteps } from './generator.js';
import { renderPlaywrightTestFromSchema } from './renderer.js';

const testInput = `
Test Name: Verify products sorted low to high

1. Go to https://www.saucedemo.com
2. Enter username standard_user
3. Enter password secret_sauce
4. Click Login
5. Sort products by price low to high
6. Verify prices are sorted ascending
`;

async function run() {
  try {
    const result = await generatePlaywrightSchemaFromSteps(testInput);

    console.log('\n=== RAW OUTPUT ===\n');
    console.log(result);

    console.log('\n=== PARSED JSON ===\n');
    const parsed = JSON.parse(result);
    console.log(parsed);

    const rendered = renderPlaywrightTestFromSchema(parsed);

    console.log('\n=== RENDERED PLAYWRIGHT ===\n');
    console.log(rendered);

  } catch (err) {
    console.error('ERROR:', err);
  }
}

run();