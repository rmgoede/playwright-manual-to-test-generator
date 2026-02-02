/**
 * Playwright Manual-to-Test Generator (V1)
 *
 * © 2026 TekQA Consulting LLC
 * All rights reserved.
 *
 * This software is provided for private/internal use only.
 * Redistribution, resale, or public publication is prohibited
 * without explicit written permission from the copyright holder.
 */

// ==================================================
// Playwright Manual-to-Test Generator — V1 LOCKED
// ==================================================
//
// V1 SCOPE (FROZEN):
// - Converts manual test steps (plain text) into
//   a SINGLE Playwright TypeScript test file
// - Output is immediately runnable ("paste & run")
// - Deterministic selector strategy (no guessing)
// - SauceDemo-specific rules are intentionally baked in
//
// VALIDATED SCENARIOS (ALL PASS):
// - Login + add to cart
// - Add multiple items + remove one
// - Checkout complete order
// - Negative login (locked out user)
// - Cart badge state (0 → 1 → 2)
//
// GUARANTEES:
// - Valid Playwright API usage only
// - No markdown or explanatory text in output
// - One test() per file
// - Stable locators preferred (test id / role / label)
//
// NON-GOALS (V1):
// - No DOM scraping or auto-discovery
// - No Excel ingestion (copy/paste only)
// - No heuristics beyond explicit rules
//
// Any enhancements beyond this point MUST go into
// V1.5+ and be documented in README.md
// ==================================================

// generator.js (ESM)

import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function parseManualInput(rawText) {
  const lines = (rawText || '').split(/\r?\n/);
  let testName = '';
  let started = false;
  const remaining = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!started && trimmed.length === 0) continue;

    if (!started) {
      const m = trimmed.match(/^test\s*name\s*:\s*(.+)$/i);
      if (m && m[1]) {
        testName = m[1].trim();
        started = true;
        continue; // omit Test Name line from steps
      }
      started = true;
    }
    remaining.push(line);
  }

  return { testName, stepsText: remaining.join('\n').trim() };
}

async function callLLM(prompt) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error(
      'OPENAI_API_KEY is not set. Make sure .env exists in the project root.'
    );
  }

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.2,
    messages: [
      {
        role: 'system',
        content:
          'You are a senior QA Automation Engineer and Playwright expert. Return ONLY valid TypeScript Playwright test code with no explanation.',
      },
      { role: 'user', content: prompt },
    ],
  });

  return response.choices?.[0]?.message?.content || '';
}

const GENERATOR_INSTRUCTIONS = `
You are a senior QA Automation Engineer specializing in Playwright + TypeScript.
Convert the provided manual test steps into a SINGLE runnable Playwright TypeScript spec.

ABSOLUTE OUTPUT RULES:
- Output ONLY valid TypeScript code (no markdown, no backticks, no prose).
- Do NOT include comments of any kind (no // or /* */).
- Must be paste-and-run as a single .spec.ts file.

REQUIRED STRUCTURE:
- Always start with: import { test, expect } from '@playwright/test';
- Exactly one test block:
  test('<TITLE>', async ({ page }) => { ... });
- Use await for all async actions.
- Prefer expect(locator).to... assertions.

TITLE:
- If a TEST_NAME is provided, use it EXACTLY as the test title.
- Otherwise derive a concise title from the steps.

WAITS / RELIABILITY:
- Do not add arbitrary timeouts.
- Prefer Playwright auto-waiting via locators + expect.
- Use toHaveURL/toBeVisible/toHaveText/toHaveCount where appropriate.

LOCATOR STRATEGY (GENERAL):
Prefer in this order:
1) page.getByTestId(...) ONLY if the steps or app-specific rules provide stable test ids
2) page.getByRole(...)
3) page.getByLabel(...)
4) page.getByPlaceholder(...)
5) page.getByText(...)
Avoid raw CSS/XPath unless truly unavoidable.

CRITICAL: LOCATOR VS PAGE METHODS (NO BUGS)
- If you have a Locator, call locator.click(), locator.fill(), etc.
- DO NOT do page.click(locator) or page.fill(locator, ...).

CRITICAL: AVOID nth()/first() FOR SEMANTIC ACTIONS
- Do NOT use .nth() or .first() to pick a product/button when the steps specify a product name.
- Only use nth/first as a last-resort fallback when no stable alternative exists.

ASSERTIONS:
- Prefer locator assertions:
  - await expect(locator).toBeVisible();
  - await expect(locator).toHaveText('...');
  - await expect(locator).toContainText('...');
  - await expect(locator).toHaveCount(n);
  - await expect(page).toHaveURL(/.../);
- Avoid: const n = await locator.count(); expect(n).toBe(...)

SAUCEDEMO-SPECIFIC RULES (apply only when URL contains "saucedemo.com"):
Login / navigation:
- username field: page.getByTestId('username')
- password field: page.getByTestId('password')
- login button: page.getByTestId('login-button')
- page header/title element: page.getByTestId('title')
- cart icon/link: page.getByTestId('shopping-cart-link')

Checkout (IMPORTANT):
- On checkout-step-one ("Checkout: Your Information"), fill fields using ONLY:
  - page.getByTestId('firstName')
  - page.getByTestId('lastName')
  - page.getByTestId('postalCode')
- Do NOT use getByLabel(...) for these fields (it can fail).

Cart badge / cart count (IMPORTANT):
- The item count badge is NOT the cart link.
- The badge is a separate element: page.locator('.shopping_cart_badge')
- When verifying the cart is empty, assert:
  await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
- When verifying counts after adding items, assert:
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1'); then '2', etc.
- Do NOT assert visibility/text on page.getByTestId('shopping-cart-link') for badge counts.

Product-specific add/remove when a product name is provided in steps:
- Prefer stable test ids using slug form:
  - Add button on Products page: page.getByTestId('add-to-cart-<slug>')
  - Remove button (Products or Cart): page.getByTestId('remove-<slug>')
Where <slug> is the product name lowercased with spaces replaced by hyphens.

If you cannot safely construct the slug or the id is uncertain, fallback to scoping:
- Products page item container: page.locator('.inventory_item').filter({ hasText: '<Product Name>' })
  then click within that container: .getByRole('button', { name: 'Add to cart' }).click()
- Cart page item container: page.locator('.cart_item').filter({ hasText: '<Product Name>' })
  then click within that container: .getByRole('button', { name: 'Remove' }).click()

SAUCEDEMO ASSERTIONS:
- After login, verify Products page:
  await expect(page.getByTestId('title')).toHaveText('Products');
- Cart page header:
  await expect(page.getByTestId('title')).toHaveText('Your Cart');
- “Cart has exactly N items”:
  await expect(page.locator('.cart_item')).toHaveCount(N);

Now generate the Playwright TypeScript spec.
`;

/**
 * Convert manual test steps (plain text) into a single Playwright TS test.
 */
export async function generatePlaywrightTestFromSteps(rawStepsText) {
  const { testName, stepsText } = parseManualInput(rawStepsText);

  const prompt = `
${GENERATOR_INSTRUCTIONS}

TEST_NAME:
${testName || '(none)'}

MANUAL_STEPS:
${stepsText}
`;

  const code = await callLLM(prompt);
  return code.trim();
}

export default generatePlaywrightTestFromSteps;
