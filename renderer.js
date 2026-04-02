function renderLocator(selector) {
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
  const lines = [];

  // import
  lines.push(`import { test, expect } from '@playwright/test';`);
  lines.push('');

  // test start
  const testName = schema.test_name || 'Generated Test';
  lines.push(`test('${testName}', async ({ page }) => {`);

  // steps
  for (const step of schema.steps) {
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
    }

    // ASSERTIONS
    if (step.type === 'assertion') {
      const assertion = step.assertion;

      if (
        assertion?.method === 'toHaveText' &&
        assertion.selector
      ) {
        const locator = renderLocator(assertion.selector);
        if (locator) {
          lines.push(
            `  await expect(${locator}).toHaveText('${assertion.expected}');`
          );
        }
      }

      if (
        assertion?.method === 'toBeVisible' &&
        assertion.selector
      ) {
        const locator = renderLocator(assertion.selector);
        if (locator) {
          lines.push(
            `  await expect(${locator}).toBeVisible();`
          );
        }
      }
    }
  }

  // test end
  lines.push(`});`);

  return lines.join('\n');
}