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
- Apply explicit transformation rules
- Emit a single Playwright `.spec.ts` file

**Key traits:**
- Rule-based (not heuristic)
- No DOM inspection
- No AI reasoning beyond explicit instructions
- No retries or timing logic

---

### 2. VS Code Extension (UI Layer)

**Responsibility:**
- Accept pasted manual steps
- Trigger generation
- Save output to disk

**Key traits:**
- Thin UI wrapper
- No business logic
- Delegates all transformation work to generator core

---

### 3. Validation Suite (External)

**Responsibility:**
- Prove correctness of generated output
- Lock behavior for a given version

**Key traits:**
- Generated tests are executed, not mocked
- Passing scenarios define the functional contract
- Failures are allowed when inputs exceed defined scope

---

## Data Flow (Conceptual)

1. User pastes manual steps
2. Generator applies deterministic rules
3. A single Playwright test file is produced
4. Test is executed without manual edits
5. Pass/fail result validates generator correctness

There is no hidden state or feedback loop.

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
- **V1.5:** Offline DOM snapshots (no runtime dependency)
- **V2:** Optional live integration (separate product tier)

Each step increases capability without breaking earlier guarantees.

---

## Guiding Principle

If the system ever becomes:
- Hard to explain
- Hard to predict
- Hard to trust

The architecture has failed its purpose.
