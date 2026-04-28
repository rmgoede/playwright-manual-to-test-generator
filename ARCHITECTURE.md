# Architecture Overview

This document provides a **high-level overview** of the system design.

It intentionally avoids implementation details.

---

## System Overview

The Playwright Manual-to-Test Generator converts **explicit manual test steps**
into **immediately runnable Playwright TypeScript tests**.

The system is designed to be:
- Deterministic
- Predictable
- Boring (by design)
- Easy to reason about

---

## Core Components

### 1. Generator Core

**Responsibility:**
- Parse pasted manual test steps
- Convert them into structured JSON (schema-driven)
- Coordinate downstream processing (validation + mapping + rendering)

**Key traits:**
- Rule-based (not heuristic)
- No live DOM inspection
- No autonomous AI reasoning beyond explicit, rule-bound instructions
- No retries or timing logic

---

### 2. Schema + Validation Layer

**Responsibility:**
- Enforce a structured contract between planning and execution
- Validate and correct selectors using optional DOM snapshots

**Key traits:**
- Deterministic corrections only
- Uses saved HTML snapshots (no live DOM)
- Preserves original selector when no safe correction is possible

---

### 3. Semantic Mapping Layer (V1.7)

**Responsibility:**
- Convert generic step intent into **element-aware behavior**
- Ensure correct Playwright actions and assertions are used

**Examples:**
- Checkbox:
  - `click` → `check()` / `uncheck()`
  - Text assertion → `toBeChecked()`

**Key traits:**
- Deterministic (rule-based mapping)
- No inference beyond explicit intent
- Operates on structured JSON, not raw text

---

### 4. Renderer

**Responsibility:**
- Convert structured JSON into Playwright TypeScript code

**Key traits:**
- Deterministic output
- No formatting variability
- No interpretation logic (pure transformation)

---

### 5. VS Code Extension (UI Layer)

**Responsibility:**
- Accept pasted manual steps
- Trigger generation
- Save output to disk

**Key traits:**
- Thin UI wrapper
- No business logic
- Delegates all transformation work to generator core

---

### 6. Validation Suite (External)

**Responsibility:**
- Prove correctness of generated output
- Lock behavior for a given version

**Key traits:**
- Generated tests are executed, not mocked
- Passing scenarios define the functional contract
- Failures are allowed when inputs exceed defined scope

---

## Data Flow (Conceptual)

Manual Steps  
→ LLM  
→ Structured JSON  
→ Schema Validation (DOM snapshot optional)  
→ Semantic Mapping  
→ Renderer  
→ Playwright TypeScript test  

Key properties:
- No hidden state
- No feedback loops
- Each stage has a single responsibility
- Output is deterministic

---

## Selector Strategy (High-Level)

The system prioritizes stable selectors:

1. `data-testid`
2. `role`
3. `label`
4. CSS (fallback)

Enhancements (V1.7.1):
- Avoid fragile `nth-of-type` patterns
- Use structured selectors with `.nth(index)` when required

---

## Intentional Exclusions

This architecture **does not** include:
- Live DOM scraping
- Test healing or self-repair
- Multi-test generation
- Framework abstraction layers
- Smart waiting or retries
- Auto-discovery of elements

These are considered **future-version concerns**.

---

## Evolution Path (High-Level)

- **V1:** Static input → deterministic output  
- **V1.5:** Structured schema + offline DOM validation  
- **V1.7:** Semantic mapping (element-aware behavior)  
- **V1.7.1:** Selector stability improvements  
- **V2:** Optional live integration (separate product tier)

Each step increases capability without breaking earlier guarantees.

---

## Guiding Principle

If the system ever becomes:
- Hard to explain
- Hard to predict
- Hard to trust

The architecture has failed its purpose.