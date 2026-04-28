# Roadmap — Playwright Manual-to-Test Generator

This roadmap communicates direction and design intent only.  
It does not represent delivery guarantees or timelines.

---

## Current State

### ✅ V1 (Core — Frozen / Locked)
- Deterministic: manual steps (plain text) → one runnable Playwright TypeScript `.spec.ts`
- Output is predictable and editable (not “smart”)
- SauceDemo rules are intentionally baked in for validation
- If a scenario is not explicitly supported, the output is allowed to fail

---

### ✅ V1.5 (Implemented — Schema + DOM Validation)
- Structured JSON schema introduced
- Optional DOM snapshot validation (no live browser dependency)
- Deterministic selector correction via schema-resolver
- No runtime DOM interaction

---

### ✅ V1.7 (Implemented — Semantic Mapping)
- Element-aware behavior introduced
- Correct Playwright APIs based on intent:
  - checkbox → `check()` / `uncheck()`
  - assertions → `toBeChecked()` / `not.toBeChecked()`
- Eliminates incorrect generic interactions (e.g. click for everything)

---

### ✅ V1.7.1 (Implemented — Selector Stability)
- Replaces fragile `nth-of-type` selectors
- Introduces structured selector + index pattern
- Renderer outputs `.nth(index)` for stability
- Improves reliability and readability of generated tests

---

## Next Phase

### 🔜 V1.8 (Planned — Dropdown Semantic Mapping)

Goals:
- Support `selectOption` for dropdowns
- Add `toHaveValue` assertions
- Extend semantic-mapper for combobox/dropdown elements
- Validate end-to-end deterministic behavior

---

## Future Enhancements (V1.x Expansion)

These are incremental improvements that preserve V1 guarantees:

- Expand element coverage:
  - input fields (text, number)
  - radio buttons
  - toggles/switches

- Improve selector strategy:
  - further reduce reliance on `.nth(index)`
  - prioritize testId / role / label more aggressively

- Output quality improvements:
  - reuse locators
  - reduce duplication
  - improve readability of generated tests

---

## Long-Term: V2 (Exploratory)

Goal: increase automation capability while preserving trust boundaries.

Possible capabilities:
- Optional live DOM inspection via Playwright
- Runtime selector validation
- Constrained, rule-based “self-healing” (opt-in only)

V2 is a **separate capability tier**, not a replacement for V1.

---

## Scope Rules

- V1 guarantees remain intact (deterministic, predictable output)
- Enhancements must not break existing behavior without versioning
- All changes must be validated via real test execution
- Documentation must reflect actual system behavior (no drift)

---

## Guiding Principle

This system prioritizes:

- Predictability over intelligence  
- Determinism over flexibility  
- Reliability over completeness  

If those are compromised, the roadmap has failed.