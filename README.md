# Playwright Manual-to-Test Generator (V1)

A deterministic internal tool that converts **manual test steps (plain text)** into a **single, immediately runnable Playwright TypeScript test**.

This project is intentionally narrow in scope. It is designed to be **predictable, boring, and reliable** — not “smart.”

---

## Prerequisites

- VS Code
- Node.js (LTS recommended)
- An existing Playwright project
  - If needed: `npm init playwright@latest`
- Playwright installed (`npx playwright install`)


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

## What This Tool Explicitly Does NOT Do (Non-Goals)

- ❌ No DOM inspection or auto-discovery
- ❌ No Excel ingestion (copy/paste only)
- ❌ No multi-test generation
- ❌ No retries, waits, or “smart” timing logic
- ❌ No framework abstraction
- ❌ No AI reasoning about intent beyond explicit rules
- ❌ No general-purpose website support

If a scenario is not explicitly supported, the output is allowed to fail.

---

## Before You Buy (Please Read)

This tool is intentionally **limited**.

You should purchase this only if:
- You are comfortable running Playwright locally
- You want **deterministic, rule-based output**
- Your use case matches the validated scenarios below
- You understand that unsupported flows may fail by design

You should **not** purchase this if you expect:
- Automatic selector discovery
- Self-healing tests
- General-purpose website support
- Ongoing feature expansion within V1

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
├── generator.js             # Core generation logic (V1 locked)
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

## What You Get

Purchasing this tool provides:

- Access to the private GitHub repository
- The full V1 generator source code
- VS Code extension for local use
- Documentation defining supported behavior
- Future V1 bug fixes (if any)

This is a **local, offline tool**.
There are no servers, accounts, or telemetry.

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

## License / Usage

Internal / experimental tooling.
All rights reserved.

Not licensed for redistribution or commercial use without explicit permission.

---

## Support & Refunds

Support is provided on a **best-effort basis**:
- Open a GitHub Issue in this repository
- Or contact via the email provided at purchase


If the tool does **not perform as described in this README** for supported scenarios,
a refund may be requested within **7 days**.

Refunds are not provided for:
- Unsupported websites or flows
- Feature requests outside V1 scope
- Modified or repackaged versions of the code

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

All rights reserved. Not licensed for redistribution or commercial use without permission.
