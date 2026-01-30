# Playwright Manual-to-Test Generator (V1)

A deterministic internal tool that converts **manual test steps (plain text)** into a **single, immediately runnable Playwright TypeScript test**.

This project is intentionally narrow in scope. It is designed to be **predictable, boring, and reliable** — not “smart.”

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

## Guaranteed Output Properties

- Valid Playwright API usage only
- No markdown, commentary, or explanations in generated output
- Stable selectors preferred
- One test file per scenario
- One `test()` per file
- Output is readable, editable, and production-style

---

## Typical Demo Workflow

1. Open an Excel sheet containing manual test steps  
2. Copy steps (including a `Test Name:` line if desired)  
3. Paste into the VS Code extension UI  
4. Click **Generate**  
5. Click **Save .spec.ts**  
6. Run via:
   ```bash
   npx playwright test tests/generated/<file>.spec.ts
7. Observe pass/fail output 
This workflow is intentional and part of the design

---

## Project Structure (Relevant Parts)
playwright-gen-prototype/
├── README.md
├── generator.js           # Core generation logic (V1 locked)
├── index.js
├── vscode-extension/
│   └── extension.js       # VS Code UI integration (V1 locked)
├── playwright-ai-starter/ # Playwright project used for execution
└── package.json

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
No guarantees beyond the validated scenarios listed above.

---

## ✅ Playwright Generator — V1 Lock Checklist

V1 is considered **DONE** when all are true:

### Core flow

- [ ] Paste manual steps into VS Code extension UI
- [ ] Click **Generate**
- [ ] Click **Save .spec.ts**
- [ ] Click ▶️ **Run** (or run via terminal)
- [ ] Test passes **without editing generated code**

### Code quality / correctness

- [ ] Output is only valid TypeScript (no markdown, no prose)
- [ ] Exactly one `test('...', async ({ page }) => { ... })`
- [ ] Uses locator actions correctly (`locator.click()`, `locator.fill()`)
- [ ] Never does invalid calls like `page.click(locator)`
- [ ] Assertions use `await expect(...)`  
      (no `expect(count).toBe()` on raw numbers)

### Selector strategy (V1 rules)

- [ ] Prefers stable selectors (`getByTestId`, `getByRole`, `getByLabel`)
- [ ] Avoids `.nth()` unless it’s a true last resort
- [ ] When product names are specified, targets those products explicitly  
      (not first/second random buttons)

### SauceDemo baked-in rules validated

- [ ] Login fields use test ids:
  - `username`
  - `password`
  - `login-button`
- [ ] Page header uses `page.getByTestId('title')`
- [ ] Cart link uses `page.getByTestId('shopping-cart-link')`
- [ ] Checkout step-one fields use:
  - `firstName`
  - `lastName`
  - `postalCode`
- [ ] Cart badge count uses `.shopping_cart_badge`:
  - Empty state → `toHaveCount(0)`
  - After 1 add → `toHaveText('1')`
  - After 2 adds → `toHaveText('2')`

### Validation suite (must all pass)

- [ ] Scenario 1: login + add to cart + verify (PASS)
- [ ] Scenario 2: add 2 items → remove 1 → verify count (PASS)
- [ ] Scenario 3: checkout complete order (PASS)
- [ ] Scenario 4: locked-out user shows error (PASS)
- [ ] Scenario 5: cart badge increments `0 → 1 → 2` (PASS)

### “Freeze V1” rules (contract with yourself)

- [ ] Any new functionality goes into **V1.5+**
- [ ] Generator instructions may not change without README update
- [ ] SauceDemo rules stay clearly labeled as **app-specific**

---

All rights reserved. Not licensed for redistribution or commercial use without permission.
