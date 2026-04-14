function renderLocator(selector) {
  // Convert a structured selector object into a Playwright locator expression.
  // Keep this intentionally small and deterministic for V1.5.
  if (!selector) return null;

  if (selector.strategy === 'testId') {
    return `page.getByTestId('${selector.value}')`;
  }

  if (selector.strategy === 'css') {
    return `page.locator('${selector.value}')`;
  }

  return null;
}

export function renderPlaywrightTestFromSchema(schema) {
  // Basic top-level schema guards.
  // Fail fast here instead of generating confusing downstream output.
  if (!schema.steps || !Array.isArray(schema.steps)) {
    throw new Error('Invalid schema: steps must be an array');
  }

  if (schema.steps.length === 0) {
    throw new Error('Invalid schema: steps must not be empty');
  }

  if (!schema.url || typeof schema.url !== 'string') {
    throw new Error('Invalid schema: url must be a string');
  }

  const lines = [];

  // Standard Playwright test import.
  lines.push(`import { test, expect } from '@playwright/test';`);
  lines.push('');

  const testName = schema.test_name || 'Generated Test';
  lines.push(`test('${testName}', async ({ page }) => {`);

  for (const step of schema.steps) {
    // Step-level validation must happen before rendering.
    if (step.type === 'action') {
      if (step.action !== 'goto' && !step.selector) {
        throw new Error(
          `Invalid action step: selector is required for action "${step.action}"`
        );
      }
    }

    if (step.type === 'assertion') {
      if (!step.assertion) {
        throw new Error('Invalid assertion step: assertion object is required');
      }

      const assertion = step.assertion;

      if (
        ['toHaveText', 'toBeVisible', 'toHaveCount'].includes(assertion.method) &&
        !assertion.selector
      ) {
        throw new Error(
          `Invalid assertion step: selector is required for "${assertion.method}"`
        );
      }
    }

    // ACTIONS
    if (step.type === 'action') {
      if (step.action === 'goto') {
        lines.push(`  await page.goto('${schema.url}');`);
      }

      if (step.action === 'fill') {
        const selector = step.selector;
        if (selector?.strategy === 'testId') {
          lines.push(
            `  await page.getByTestId('${selector.value}').fill('${step.value}');`
          );
        }
      }

      if (step.action === 'click') {
        const selector = step.selector;
        if (selector?.strategy === 'testId') {
          lines.push(
            `  await page.getByTestId('${selector.value}').click();`
          );
        }
      }

      if (step.action === 'select') {
        const selector = step.selector;
        if (selector?.strategy === 'role' && selector.value === 'combobox') {
          lines.push(
            `  await page.getByRole('combobox').selectOption({ label: '${step.value}' });`
          );
        }
      }
    }

    // ASSERTIONS
    if (step.type === 'assertion') {
      const assertion = step.assertion;

      if (assertion?.method === 'toHaveText' && assertion.selector) {
        const locator = renderLocator(assertion.selector);
        if (locator) {
          lines.push(
            `  await expect(${locator}).toHaveText('${assertion.expected}');`
          );
        }
      }

      if (assertion?.method === 'toBeVisible' && assertion.selector) {
        const locator = renderLocator(assertion.selector);
        if (locator) {
          lines.push(`  await expect(${locator}).toBeVisible();`);
        }
      }

      if (assertion?.method === 'toHaveURL' && assertion.selector === null) {
        lines.push(
          `  await expect(page).toHaveURL('${assertion.expected}');`
        );
      }

      if (assertion?.method === 'toHaveCount' && assertion.selector) {
        const locator = renderLocator(assertion.selector);
        if (locator) {
          lines.push(
            `  await expect(${locator}).toHaveCount(${assertion.expected});`
          );
        }
      }

      if (assertion?.method === 'pricesSortedAscending') {
        // Custom assertion logic for derived values rather than direct expect(locator).
        lines.push(
          `  const priceTexts = await page.locator('.inventory_item_price').allTextContents();`
        );
        lines.push(
          `  const prices = priceTexts.map(text => Number(text.replace('$', '')));`
        );
        lines.push(
          `  const sortedPrices = [...prices].sort((a, b) => a - b);`
        );
        lines.push(`  expect(prices).toEqual(sortedPrices);`);
      }
    }
  }

  lines.push(`});`);

  return lines.join('\n');
}