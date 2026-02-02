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

// vscode-extension/extension.js

const vscode = require('vscode');
const path = require('path');
const OpenAI = require('openai');

// Load API key from ../.env (same root as your CLI prototype)
require('dotenv').config({
  path: path.join(__dirname, '../.env'),
});

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ------------------------
// Helpers
// ------------------------
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

  return {
    testName,
    stepsText: remaining.join('\n').trim(),
  };
}

// ------------------------
// LLM helper
// ------------------------
async function callLLM(prompt) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error(
      'OPENAI_API_KEY is not set. Make sure .env exists in the root and VS Code was restarted.'
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

// ------------------------
// Unified generator instructions (tightened + checkout fix + cart badge fix)
// ------------------------
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

// ------------------------
// High-level: manual steps -> Playwright TS
// ------------------------
async function generatePlaywrightTestFromSteps(rawStepsText) {
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

// ------------------------
// Webview HTML
// ------------------------
function getWebviewContent() {
  return /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Playwright Test Generator</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      margin: 0;
      padding: 16px;
      color: #ddd;
      background-color: #1e1e1e;
    }
    h2 { margin-top: 0; }
    textarea {
      width: 100%;
      box-sizing: border-box;
      background-color: #1e1e1e;
      color: #ddd;
      border: 1px solid #444;
      border-radius: 4px;
      padding: 8px;
      font-family: Menlo, Consolas, monospace;
      font-size: 12px;
      resize: vertical;
    }
    button {
      background-color: #0e639c;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 6px 12px;
      margin-right: 8px;
      cursor: pointer;
      font-size: 12px;
    }
    button:hover { background-color: #1177bb; }
    button:disabled { opacity: 0.6; cursor: default; }
    .section-title { margin-top: 24px; margin-bottom: 4px; font-weight: 600; }
    .subtext { font-size: 11px; opacity: 0.7; margin-bottom: 4px; }
    .toolbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; margin-top: 8px; }
    .toolbar-left { font-size: 12px; opacity: 0.8; }
    .toolbar-right button { margin-right: 4px; }
  </style>
</head>
<body>
  <h2>Playwright Test Generator</h2>

  <div class="subtext">Paste manual test steps and click Generate.</div>
  <textarea id="steps" rows="10" placeholder="Test Name: Cart badge increments to 2 after adding two items
1. Go to https://www.saucedemo.com/
2. Enter username &quot;standard_user&quot;
3. Enter password &quot;secret_sauce&quot;
4. Click Login
..."></textarea>

  <div style="margin-top: 8px;">
    <button id="generateBtn">Generate</button>
  </div>

  <div class="section-title">Generated Playwright test</div>
  <div class="toolbar">
    <div class="toolbar-left">
      TypeScript output (ready to paste into a .spec.ts file).
    </div>
    <div class="toolbar-right">
      <button id="copyBtn">Copy</button>
      <button id="saveBtn">Save .spec.ts</button>
    </div>
  </div>
  <textarea id="output" rows="18" placeholder="Generated Playwright TypeScript test will appear here..."></textarea>

  <script>
    const vscode = acquireVsCodeApi();

    const stepsEl = document.getElementById('steps');
    const outputEl = document.getElementById('output');
    const generateBtn = document.getElementById('generateBtn');
    const copyBtn = document.getElementById('copyBtn');
    const saveBtn = document.getElementById('saveBtn');

    generateBtn.addEventListener('click', () => {
      const text = stepsEl.value.trim();
      if (!text) {
        vscode.postMessage({ command: 'info', message: 'Please paste some manual steps before generating.' });
        return;
      }
      generateBtn.disabled = true;
      generateBtn.textContent = 'Generating...';
      vscode.postMessage({ command: 'generate', text });
    });

    copyBtn.addEventListener('click', async () => {
      const code = outputEl.value.trim();
      if (!code) {
        vscode.postMessage({ command: 'info', message: 'Nothing to copy yet. Generate a test first.' });
        return;
      }
      try {
        await navigator.clipboard.writeText(code);
        vscode.postMessage({ command: 'info', message: 'Generated test copied to clipboard.' });
      } catch (err) {
        vscode.postMessage({ command: 'error', message: 'Unable to access clipboard from webview.' });
      }
    });

    saveBtn.addEventListener('click', () => {
      const code = outputEl.value.trim();
      if (!code) {
        vscode.postMessage({ command: 'info', message: 'Nothing to save yet. Generate a test first.' });
        return;
      }
      vscode.postMessage({ command: 'saveTest', code });
    });

    window.addEventListener('message', event => {
      const message = event.data;
      if (message.command === 'generated') {
        outputEl.value = message.code || '';
        generateBtn.disabled = false;
        generateBtn.textContent = 'Generate';
      }
    });
  </script>
</body>
</html>`;
}

// ------------------------
// Filename derivation + save helper
// ------------------------
function deriveSpecFilenameFromCode(code) {
  const match = code.match(/test\(['"](.+?)['"]\s*,/);
  let title = match ? match[1] : 'generated-test';

  let slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (!slug) slug = 'generated-test';
  return slug + '.spec.ts';
}

async function saveGeneratedTestToFile(code) {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    vscode.window.showErrorMessage('No workspace folder is open. Cannot save file.');
    return;
  }

  const rootUri = workspaceFolders[0].uri;
  const targetDir = vscode.Uri.joinPath(rootUri, 'tests', 'generated');
  await vscode.workspace.fs.createDirectory(targetDir);

  const filename = deriveSpecFilenameFromCode(code);
  const fileUri = vscode.Uri.joinPath(targetDir, filename);

  const encoder = new TextEncoder();
  await vscode.workspace.fs.writeFile(fileUri, encoder.encode(code));

  const relative = vscode.workspace.asRelativePath(fileUri);
  vscode.window.showInformationMessage(`Saved generated test to ${relative}`);

  const doc = await vscode.workspace.openTextDocument(fileUri);
  await vscode.window.showTextDocument(doc, vscode.ViewColumn.Two);
}

// ------------------------
// VS Code extension entry points
// ------------------------
function activate(context) {
  console.log('Playwright Test Generator extension is active!');

  const disposable = vscode.commands.registerCommand(
    'playwrightGen.generate',
    async function () {
      const panel = vscode.window.createWebviewPanel(
        'playwrightTestGenerator',
        'Playwright Test Generator',
        vscode.ViewColumn.One,
        { enableScripts: true }
      );

      panel.webview.html = getWebviewContent();

      panel.webview.onDidReceiveMessage(
        async (message) => {
          if (message.command === 'generate') {
            try {
              const code = await generatePlaywrightTestFromSteps(message.text || '');
              panel.webview.postMessage({ command: 'generated', code });
            } catch (err) {
              console.error('Error generating test from extension:', err);
              vscode.window.showErrorMessage('Error generating Playwright test. Check console for details.');
              panel.webview.postMessage({
                command: 'generated',
                code: "import { test, expect } from '@playwright/test';\n\ntest('generation error', async ({ page }) => {\n  await page.goto('about:blank');\n  await expect(page).toHaveURL(/about:blank/);\n});",
              });
            }
          } else if (message.command === 'saveTest') {
            try {
              await saveGeneratedTestToFile(message.code || '');
            } catch (err) {
              console.error('Error saving generated test:', err);
              vscode.window.showErrorMessage('Error saving generated test file. See console for details.');
            }
          } else if (message.command === 'info') {
            if (message.message) vscode.window.showInformationMessage(message.message);
          } else if (message.command === 'error') {
            if (message.message) vscode.window.showErrorMessage(message.message);
          }
        },
        undefined,
        context.subscriptions
      );
    }
  );

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = { activate, deactivate };
