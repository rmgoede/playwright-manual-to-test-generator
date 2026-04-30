function quote(value) {
  return JSON.stringify(value);
}

function renderLocator(selector) {
  // Convert a structured selector object into a Playwright locator expression.
  if (!selector) return null;

  let base = null;

  if (selector.strategy === 'testId') {
    base = `page.getByTestId(${quote(selector.value)})`;
  }

  if (selector.strategy === 'label') {
    base = `page.getByLabel(${quote(selector.value)})`;
  }

  if (selector.strategy === 'role') {
    base = `page.getByRole(${quote(selector.value)})`;
  }

  if (selector.strategy === 'css') {
    base = `page.locator(${quote(selector.value)})`;
  }

  if (!base) return null;

  // Apply nth(index) if present
  if (typeof selector.index === 'number') {
    return `${base}.nth(${selector.index})`;
  }

  return base;
}

export function renderPlaywrightTestFromSchema(schema) {
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

  lines.push(`import { test, expect } from '@playwright/test';`);
  lines.push('');

  const testName = schema.test_name || 'Generated Test';
  lines.push(`test(${quote(testName)}, async ({ page }) => {`);

  for (const step of schema.steps) {
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
        lines.push(`  await page.goto(${quote(schema.url)});`);
      }

      if (step.action === 'fill') {
        const locator = renderLocator(step.selector);
        if (locator) {
          lines.push(`  await ${locator}.fill(${quote(step.value)});`);
        }
      }

      if (step.action === 'click') {
        const selector = step.selector;

        // Prefer role-based click for buttons
        if (selector?.strategy === 'label') {
            lines.push(
            `  await page.getByRole('button', { name: ${quote(selector.value)} }).click();`
          );
        } else {
          const locator = renderLocator(selector);
          if (locator) {
            lines.push(`  await ${locator}.click();`);
          }
        }
      }
      if (step.action === 'check') {
        const locator = renderLocator(step.selector);
        if (locator) {
          lines.push(`  await ${locator}.check();`);
        }
      }
      if (step.action === 'uncheck') {
        const locator = renderLocator(step.selector);
        if (locator) {
          lines.push(`  await ${locator}.uncheck();`);
        }
      }
      if (step.action === 'select') {
        const selector = step.selector;
        if (selector?.strategy === 'role' && selector.value === 'combobox') {
          lines.push(
            `  await page.getByRole('combobox').selectOption({ label: ${quote(step.value)} });`
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
            `  await expect(${locator}).toHaveText(${quote(assertion.expected)});`
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
          `  await expect(page).toHaveURL(${quote(assertion.expected)});`
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

      if (assertion?.method === 'toBeChecked' && assertion.selector) {
        const locator = renderLocator(assertion.selector);
        if (locator) {
          lines.push(`  await expect(${locator}).toBeChecked();`);
        }
      }

      if (assertion?.method === 'toHaveValue' && assertion.selector) {
        const locator = renderLocator(assertion.selector);
        if (locator) {
          lines.push(`  await expect(${locator}).toHaveValue(${quote(assertion.expected)});`);
        }
      }

      if (assertion?.method === 'not.toBeChecked' && assertion.selector) {
        const locator = renderLocator(assertion.selector);
        if (locator) {
          lines.push(`  await expect(${locator}).not.toBeChecked();`);
        }
      }

      if (assertion?.method === 'pricesSortedAscending') {
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