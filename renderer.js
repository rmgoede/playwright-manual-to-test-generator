import { resolveLocatorFromSnapshot } from "./src/snapshot-selector-pipeline.js";

function quote(value) {
  return JSON.stringify(value);
}

function renderLocator(selector) {
  if (!selector) return null;

  let base = null;

  if (selector.strategy === "testId") {
    base = `page.getByTestId(${quote(selector.value)})`;
  }
  if (selector.strategy === "id") {
    base = `page.locator("#${selector.value}")`;
  }
  if (selector.strategy === "text") {
  base = `page.getByText(${quote(selector.value)})`;
  }
  if (selector.strategy === "label") {
    base = `page.getByLabel(${quote(selector.value)})`;
  }

  if (selector.strategy === "role") {
    base = `page.getByRole(${quote(selector.value)})`;
  }

  if (selector.strategy === "css") {
    base = `page.locator(${quote(selector.value)})`;
  }

  if (!base) return null;

  if (typeof selector.index === "number") {
    return `${base}.nth(${selector.index})`;
  }

  return base;
}

function resolveSelectorIfMissing(step, snapshotPath) {
  if (step.selector) return step.selector;
  if (!snapshotPath) return null;

  const intent = step.intent || step.value;
  if (!intent) return null;

  const result = resolveLocatorFromSnapshot(snapshotPath, intent);
  return result.selector || null;
}

export function renderPlaywrightTestFromSchema(schema) {
  if (!schema.steps || !Array.isArray(schema.steps)) {
    throw new Error("Invalid schema: steps must be an array");
  }

  if (schema.steps.length === 0) {
    throw new Error("Invalid schema: steps must not be empty");
  }

  if (!schema.url || typeof schema.url !== "string") {
    throw new Error("Invalid schema: url must be a string");
  }

  const snapshotPath = schema.snapshotPath || null;
  const lines = [];

  lines.push(`import { test, expect } from '@playwright/test';`);
  lines.push("");

  const testName = schema.test_name || "Generated Test";
  lines.push(`test(${quote(testName)}, async ({ page }) => {`);

  for (const step of schema.steps) {
    const stepSnapshotPath = step.snapshotPath || snapshotPath;

    const resolvedSelector =
      step.type === "action"
    ? resolveSelectorIfMissing(step, stepSnapshotPath)
    : step.selector;

    if (step.type === "action") {
      if (step.action !== "goto" && !resolvedSelector) {
        throw new Error(
          `Invalid action step: selector is required for action "${step.action}"`
        );
      }
    }

    if (step.type === "assertion") {
      if (!step.assertion) {
        throw new Error("Invalid assertion step: assertion object is required");
      }

      const assertion = step.assertion;

      if (
        ["toHaveText", "toBeVisible", "toHaveCount"].includes(assertion.method) &&
        !assertion.selector
      ) {
        throw new Error(
          `Invalid assertion step: selector is required for "${assertion.method}"`
        );
      }
    }

    if (step.type === "action") {
      if (step.action === "goto") {
        lines.push(`  await page.goto(${quote(schema.url)});`);
      }

      if (step.action === "fill") {
        const locator = renderLocator(resolvedSelector);
        if (locator) {
          lines.push(`  await ${locator}.fill(${quote(step.value)});`);
        }
      }

      if (step.action === "click") {
        const selector = resolvedSelector;

        if (selector?.strategy === "label") {
          lines.push(
            `  await page.getByRole('button', { name: ${quote(selector.value)} }).click();`
          );
        } else {
          if (selector?.strategy === "text") {
            lines.push(
              `  await page.getByRole('button', { name: /${selector.value}/ }).click();`
            );
          } else {
            const locator = renderLocator(selector);
            if (locator) {
              lines.push(`  await ${locator}.click();`);
            }
          }
        }
      }

      if (step.action === "check") {
        const locator = renderLocator(resolvedSelector);
        if (locator) {
          lines.push(`  await ${locator}.check();`);
        }
      }

      if (step.action === "uncheck") {
        const locator = renderLocator(resolvedSelector);
        if (locator) {
          lines.push(`  await ${locator}.uncheck();`);
        }
      }

      if (step.action === "select") {
        const locator = renderLocator(resolvedSelector);
        if (locator) {
          lines.push(
            `  await ${locator}.selectOption({ label: ${quote(step.value)} });`
          );
        }
      }
    }

    if (step.type === "assertion") {
      const assertion = step.assertion;

      if (assertion?.method === "toHaveText" && assertion.selector) {
        const locator = renderLocator(assertion.selector);
        if (locator) {
          lines.push(
            `  await expect(${locator}).toHaveText(${quote(assertion.expected)});`
          );
        }
      }
        if (assertion?.method === "rowContainsText" && assertion.selector) {
        const locator = renderLocator(assertion.selector);
        const expectedTokens = Array.isArray(assertion.expected)
          ? assertion.expected
          : [assertion.expected];

        if (locator) {
          const filteredLocator = expectedTokens.reduce((current, token) => {
            return `${current}.filter({ hasText: ${quote(token)} })`;
          }, locator);

          lines.push(`  await expect(${filteredLocator}.first()).toBeVisible();`);
        }
      }
      if (assertion?.method === "toBeVisible" && assertion.selector) {
        const locator = renderLocator(assertion.selector);
        if (locator) {
          lines.push(`  await expect(${locator}).toBeVisible();`);
        }
      }

      if (assertion?.method === "toHaveURL" && assertion.selector === null) {
        lines.push(`  await expect(page).toHaveURL(${quote(assertion.expected)});`);
      }

      if (assertion?.method === "toHaveCount" && assertion.selector) {
        const locator = renderLocator(assertion.selector);
        if (locator) {
          lines.push(
            `  await expect(${locator}).toHaveCount(${assertion.expected});`
          );
        }
      }

      if (assertion?.method === "toBeChecked" && assertion.selector) {
        const locator = renderLocator(assertion.selector);
        if (locator) {
          lines.push(`  await expect(${locator}).toBeChecked();`);
        }
      }

      if (assertion?.method === "toHaveValue" && assertion.selector) {
        const locator = renderLocator(assertion.selector);
        if (locator) {
          lines.push(
            `  await expect(${locator}).toHaveValue(${quote(assertion.expected)});`
          );
        }
      }

      if (assertion?.method === "not.toBeChecked" && assertion.selector) {
        const locator = renderLocator(assertion.selector);
        if (locator) {
          lines.push(`  await expect(${locator}).not.toBeChecked();`);
        }
      }

      if (assertion?.method === "pricesSortedAscending") {
        lines.push(
          `  const priceTexts = await page.locator('.inventory_item_price').allTextContents();`
        );
        lines.push(
          `  const prices = priceTexts.map(text => Number(text.replace('$', '')));`
        );
        lines.push(`  const sortedPrices = [...prices].sort((a, b) => a - b);`);
        lines.push(`  expect(prices).toEqual(sortedPrices);`);
      }
    }
  }

  lines.push(`});`);

  return lines.join("\n");
}