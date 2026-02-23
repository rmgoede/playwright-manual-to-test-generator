# Contributing Guidelines (Private)

This repository is a **private, experimental product workspace**.

It is intentionally **not** open-source at this stage.

---

## Project Status

- **Current version:** V1 (Frozen)
- **Scope:** Deterministic manual-step → Playwright test generation
- **Audience:** Internal use, product exploration, and controlled demos
- **License:** MIT

V1 is considered **complete and locked**.  
Any future work must follow the versioning rules below.

---

## Versioning Rules

### V1 (Frozen)
- No functional changes
- No scope expansion
- Only documentation clarifications if needed
- Generator behavior must remain stable and predictable

### V1.5+
- New functionality must be explicitly planned and documented
- Experimental features belong in separate branches
- Validation scenarios must be updated alongside changes

---

## Design Philosophy (Non-Negotiable)

- Deterministic > clever
- Explicit rules > inference
- Predictable failures > hidden magic
- Readable output > compressed abstractions
- QA engineer trust > AI novelty

If a feature makes the system “smarter” but less predictable, it does **not** belong in V1.

---

## Intellectual Property

All code and documentation in this repository are provided under the MIT License. See LICENSE.

- Do not redistribute
- Do not publish derivative work
- Do not extract logic for external tools
- Do not share implementation details publicly

External discussions should remain **conceptual**, not technical.

---

## Contributions

At this stage:
- Contributions are limited to the repository owner
- External PRs are not accepted
- Feedback is captured in notes or roadmap documents, not issues

This may change in later versions.

---

## Questions

If something feels ambiguous:
- Default to **not changing behavior**
- Document the question instead
- Revisit during a planned version bump
