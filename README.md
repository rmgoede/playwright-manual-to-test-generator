![GitHub stars](https://img.shields.io/github/stars/rmgoede/playwright-manual-to-test-generator?style=social)
![License](https://img.shields.io/github/license/rmgoede/playwright-manual-to-test-generator)
# Playwright Manual-to-Test Generator (V1)

A deterministic QA tool that converts **manual test steps (plain text)** into a **single, immediately runnable Playwright TypeScript test**.

This project is intentionally narrow in scope. It is designed to be **predictable, boring, and reliable** — not “smart.”
## Screenshots / Demo
![Playwright Manual-to-Test Generator Demo](DemoFinal.gif)
*Demo: Copy manual test steps → generate runnable Playwright test → save → execute.*
---

## Example

### Input (Manual Steps)

1. Go to https://www.saucedemo.com  
2. Enter username standard_user  
3. Enter password secret_sauce  
4. Click Login  
5. Verify Products is visible  

### Output (Generated Playwright Test)

```ts
import { test, expect } from '@playwright/test';

test('Login and verify products title visible', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await page.getByTestId('username').fill('standard_user');
  await page.getByTestId('password').fill('secret_sauce');
  await page.getByTestId('login-button').click();
  await expect(page.getByTestId('title')).toBeVisible();
});
```
---

## Prerequisites

- VS Code
- Node.js (LTS recommended)
- An existing Playwright project
  - If needed: `npm init playwright@latest`
- Playwright installed (`npx playwright install`)
- An OpenAI API key (API usage billed directly by OpenAI)

### Why bring your own OpenAI key?

- You control API costs
- No vendor lock-in
- No usage markup
- No data stored by this tool
- Typical cost per generation: a few cents

---

## What This Tool Does (V1 Scope — Frozen)

- Converts **copied/pasted manual test steps** into:
  - **One** Playwright `.spec.ts` file
  - **One** `test()` per file
- Output is **immediately runnable** (paste → save → run)
- Uses **deterministic selectors only**
  - Prefers `data-testid`, then `role`, then `label`
  - No guessing, no DOM scraping, no heuristics
- Designed and validated specifically against **saucedemo.com**
- Intended for **QA engineers**, not end users

---

## How It Works

The codebase supports two generation paths:

### V1 (Current User Flow — Extension Demo)

Manual Steps  
→ LLM  
→ Playwright TypeScript test  

This is the workflow shown in the demo. Internally, the extension now uses the V1.5 structured pipeline while preserving the same user experience.

---

## V1.5 (Structured Architecture — Active / Internal)

Manual Steps  
→ LLM  
→ Structured JSON (schema-enforced)  
→ (optional) DOM validation layer  
→ Renderer  
→ Playwright TypeScript test  

Key idea:
- The LLM does NOT directly generate test code
- It produces structured JSON first
- A renderer converts that JSON into deterministic Playwright code

Why this matters:
- More consistent output
- Reduced variability across runs
- Clear validation boundaries between planning and execution

Note:
V1.5 is now used internally by the extension’s Generate flow, while maintaining the same user experience.

---
## V1.6 (DOM Snapshot Validation — Phase 1)
**Note:** This feature relies on local DOM parsing (via jsdom) and requires no additional setup beyond `npm install`.

Manual steps  
→ LLM  
→ JSON (raw, possibly imperfect)  
→ schema-resolver (uses DOM snapshot)  
→ corrected JSON (deterministic)  
→ renderer  
→ Playwright code  

Key idea:
- The LLM proposes selectors
- The system validates and corrects selectors using a saved DOM snapshot
- Corrections are applied only when confidence is high

Selector resolution behavior:
1. Prefer `data-testid` when present in the DOM
2. Fallback to `label` when a reliable match can be derived
3. If no safe correction is possible, preserve the original selector

Why this matters:
- Reduces incorrect selector generation
- Avoids unsafe “AI guessing”
- Introduces deterministic validation into the pipeline
- Maintains V1 philosophy: reliability over intelligence

Important:
- This is NOT live DOM scraping
- This uses a saved HTML snapshot only
- Behavior is optional — if no snapshot is provided, V1.5 behavior is preserved
- Supports optional DOM snapshot–based validation of selectors

### Providing a DOM Snapshot (temporary)

V1.6 can optionally validate selectors against a DOM snapshot (a saved HTML file).

**Quick way to get a snapshot:**

1. Open the target page in your browser  
2. Right-click → **Save Page As…**  
3. Save as **HTML** (e.g., `snapshot.html`)  
4. Place the file in your project  

**Use it (current / developer usage):**

Provide the path to a saved HTML file representing the page under test.

This feature is currently available via the generator API (programmatic usage).

```js
import { generatePlaywrightSchemaFromSteps } from './generator.js';

const steps = `
1. Go to https://www.saucedemo.com
2. Enter username standard_user
3. Enter password secret_sauce
4. Click Login
`;

const schemaJson = await generatePlaywrightSchemaFromSteps(
  steps,
  './snapshot.html' // path to your saved HTML snapshot
);

console.log(schemaJson);
```


**Note:**
UI-based snapshot capture (via the VS Code extension) is planned and will remove the need to manually provide a file path.

**Notes:**

- Snapshot is static HTML only (no live DOM scraping)  
- If no snapshot is provided, V1.5 behavior is preserved  
---
## What This Tool Explicitly Does NOT Do (Non-Goals)

- ❌ No live DOM inspection or auto-discovery
- ❌ No Excel ingestion (copy/paste only)
- ❌ No multi-test generation
- ❌ No retries, waits, or “smart” timing logic
- ❌ No framework abstraction
- ❌ No AI reasoning about intent beyond explicit rules
- ❌ No general-purpose website support

If a scenario is not explicitly supported, the output is allowed to fail.

---

## Who This Is For

This tool is a good fit if you:
- Are comfortable running Playwright locally
- Want a repeatable workflow for generating a Playwright test draft from written steps
- Are OK refining selectors after inspecting the real DOM (expected by design)
- Can supply your own OpenAI API key for local execution (`OPENAI_API_KEY`)

This tool is **not** a fit if you expect:
- DOM auto-discovery or scraping
- Self-healing automation
- A SaaS / hosted product
- Guaranteed “first run pass” on arbitrary websites

---

## Validated Scenarios (All Passing)

The following scenarios have been **generated, saved, and executed successfully**:

1. Login and add item to cart
2. Add multiple items and remove one
3. Checkout complete order
4. Negative login (locked-out user)
5. Cart badge state changes (0 → 1 → 2)
6. Product sorting (low to high price)

These scenarios define the **functional contract** of V1.

---

## Quick Start (5 Minutes)
1. Clone the repository:
```bash
    git clone <repo-url>
    cd playwright-gen-prototype
```
  (In GitHub, click **Code** → copy the HTTPS URL)

2. Install dependencies:
```bash
    npm install
```
3. Open the project in VS Code:
```bash
    code .
```
4. Start the VS Code extension:

    - Press F5 to launch the extension in a new Extension Development Host window

    - In that new window, open **your Playwright project** (the repo where you will run tests)
    
    
5. Generate a test:
   - Paste your manual test steps
   - Click **Generate**
   - Click **Save .spec.ts**
   - The generated `.spec.ts` file is saved into your Playwright project under the generator’s configured output directory

6. Run via:
   ```bash
   npx playwright test <path-to-the-generated-spec-file>
   ```
   - Use the relative path to the generated `.spec.ts` file in your Playwright project.


If these steps complete without error, your setup is correct.

---

## Guaranteed Output Properties

- Valid Playwright API usage only
- No markdown, commentary, or explanations in generated output
- Stable selectors preferred
- One test file per scenario
- One `test()` per file
- Output is readable, editable, and production-style

---

## Typical Demo Workflow
This describes the intended usage pattern once the extension is running.
1. Open an Excel sheet containing manual test steps
2. Copy steps (including a `Test Name:` line if desired)
3. Paste into the VS Code extension UI
4. Click **Generate**
5. Click **Save .spec.ts**
6. Run via:

   npx playwright test `<path-to-the-generated-spec-file>`
  - (Use the relative path to the generated `.spec.ts` file in your Playwright project.)

7. Observe pass/fail output

This workflow is intentional and part of the design.

---

## Project Structure (Relevant to Users)
```
playwright-gen-prototype/
├── README.md                # Product spec & usage contract
├── generator.js             # Core generation logic (V1 + V1.5 schema mode)
├── renderer.js              # Converts structured JSON → Playwright test
├── dom-snapshot-resolver.js # DOM-based selector lookup
├── schema-resolver.js       # Applies deterministic corrections to JSON
├── index.js                 # CLI / entry wiring
├── vscode-extension/
│   └── extension.js         # VS Code UI integration (V1 locked)
├── package.json
└── package-lock.json
```

Most users will interact only with:
- The VS Code extension UI
- The generated `.spec.ts` output
- Their own Playwright project

---

## What You Get (Open-Source)

- Generator core source code
- VS Code extension for local use
- Documentation defining supported behavior and scope
- A deterministic workflow: paste → generate → save → run

---

## Versioning Philosophy

- **V1 is frozen**
- Any enhancements must:
  - Be explicitly defined
  - Be validated with passing scenarios
  - Move into **V1.5 or V2**
  - Be documented before implementation

No silent scope expansion.

---

## Intended Audience

- Senior QA engineers
- Test automation engineers
- Teams converting manual regression suites to Playwright
- Internal tooling / proof-of-concept automation accelerators

This is **not** a low-code testing product.

---

## License

MIT License. See `LICENSE`.

---

## Support

Best-effort support via GitHub Issues.
PRs are welcome.

---

## Playwright Generator — V1 Lock Checklist

V1 is considered **DONE** when all are true:

### Core flow

- [ ] Paste manual steps into VS Code extension UI
- [ ] Click **Generate**
- [ ] Click **Save .spec.ts**
- [ ] Click ▶️ **Run** (or run via terminal)
- [ ] Test passes **without editing generated code**

### Code quality / correctness

- [ ] Output is only valid TypeScript (no markdown, no prose)
- [ ] Exactly one test('...', async ({ page }) => { ... })
- [ ] Uses locator actions correctly (locator.click(), locator.fill())
- [ ] Never does invalid calls like page.click(locator)
- [ ] Assertions use await expect(...)

### Selector strategy (V1 rules)

- [ ] Prefers stable selectors (getByTestId, getByRole, getByLabel)
- [ ] Avoids .nth() unless it’s a true last resort
- [ ] When product names are specified, targets those products explicitly

### SauceDemo baked-in rules validated

- [ ] Login fields use test ids: username, password, login-button
- [ ] Page header uses page.getByTestId('title')
- [ ] Cart link uses page.getByTestId('shopping-cart-link')
- [ ] Checkout step-one fields use firstName, lastName, postalCode
- [ ] Cart badge count uses .shopping_cart_badge:
  - Empty → toHaveCount(0)
  - After 1 add → toHaveText('1')
  - After 2 adds → toHaveText('2')

### Validation suite (must all pass)

- [ ] Scenario 1: login + add to cart + verify (PASS)
- [ ] Scenario 2: add 2 items → remove 1 → verify count (PASS)
- [ ] Scenario 3: checkout complete order (PASS)
- [ ] Scenario 4: locked-out user shows error (PASS)
- [ ] Scenario 5: cart badge increments 0 → 1 → 2 (PASS)

### Freeze V1 Rules (V1 Scope & Change Control)

- [ ] Any new functionality goes into **V1.5+**
- [ ] Generator instructions may not change without README update
- [ ] SauceDemo rules stay clearly labeled as app-specific
---

