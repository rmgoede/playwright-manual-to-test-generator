# Contributing Guidelines

Thanks for your interest in improving the Playwright Manual-to-Test Generator.

This project is open-source under the MIT License and welcomes feedback, issues, and contributions that align with the project's design philosophy and scope.

---

## Project Status

- **Core Version:** V1 (Frozen)
- **Current Implementation:** V1.7.1
- **Scope:** Deterministic manual-step → Playwright test generation
- **Audience:** QA engineers, test automation engineers, and teams migrating manual tests to Playwright
- **License:** MIT

The system has evolved beyond V1, but **V1 guarantees remain locked**.

---

## Versioning Rules

### V1 (Core — Frozen)
- No functional changes to core behavior
- No scope expansion of base assumptions
- Only documentation clarifications allowed
- Output must remain deterministic and predictable

---

### V1.x (Extensions — Active)

All new capabilities (e.g. V1.5, V1.7, V1.7.1) are considered **extensions of V1**, not replacements.

Rules:
- Must preserve V1 guarantees
- Must be deterministic (no hidden behavior)
- Must be explicitly documented
- Must include validation scenarios
- Must not introduce unpredictable output

Examples:
- V1.5 → schema + DOM snapshot validation  
- V1.7 → semantic mapping  
- V1.7.1 → selector stability  

---

### V2 (Future — Separate Tier)

- May introduce non-deterministic or adaptive behavior
- May include live DOM interaction or “smart” features
- Will be clearly separated from V1 guarantees

---

## Design Philosophy (Non-Negotiable)

- Deterministic > clever
- Explicit rules > inference
- Predictable failures > hidden magic
- Readable output > compressed abstractions
- QA engineer trust > AI novelty

If a feature makes the system “smarter” but less predictable, it does **not** belong in V1.x.

---

## Contributions

At this stage:

- Issues and feedback are welcome
- Feature direction is controlled by the repository owner
- Pull requests may not be accepted unless aligned with the roadmap

Contributions must:
- Respect versioning rules
- Preserve deterministic behavior
- Avoid expanding scope without explicit versioning

---

## Questions

If something feels ambiguous:

- Default to **not changing behavior**
- Document the question instead
- Revisit during a planned version bump