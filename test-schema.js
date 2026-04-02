import { generatePlaywrightSchemaFromSteps } from './generator.js';
import { renderPlaywrightTestFromSchema } from './renderer.js';

const testInput = `
Test Name: Add item to cart

1. Go to https://www.saucedemo.com
2. Enter username standard_user
3. Enter password secret_sauce
4. Click login
5. Add Sauce Labs Backpack to cart
6. Verify cart badge shows 1
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