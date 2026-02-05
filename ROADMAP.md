# Roadmap — Playwright Manual-to-Test Generator

This roadmap communicates direction and design intent only.
It does not represent delivery guarantees or timelines.

V1 scope is intentionally narrow and frozen.

---

## Current State

✅ **V1 (Frozen / Locked)**
- Deterministic: manual steps (plain text) → one runnable Playwright TypeScript `.spec.ts`
- Output is meant to be predictable and editable (not “smart”)
- SauceDemo rules are intentionally baked in for validation
- If a scenario is not explicitly supported, the output is allowed to fail

---

## Potential: V1.5 (Offline DOM Snapshot)

Goal: improve selector accuracy without live browser control.

Possible approach:
- Capture an HTML/DOM snapshot for a target page
- Feed snapshot + manual steps into the generator
- Deterministic selector improvements using richer context

---

## Long-Term: V2 (Live DOM + Playwright Integration)

Goal: highest reliability and maintenance reduction.

Possible capabilities:
- Use Playwright to inspect DOM at runtime
- Validate selectors and improve robustness
- Optional constrained “self-heal” attempts

---

## Scope Rules

- V1 behavior is locked.
- Enhancements must land in V1.5+ and be validated with passing scenarios.
- If output behavior changes, documentation and validation must be updated.