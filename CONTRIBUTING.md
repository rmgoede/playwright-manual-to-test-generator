# Contributing Guidelines

Thanks for your interest in improving the Playwright Manual-to-Test Generator.

This project is open-source under the MIT License and welcomes feedback, issues, and contributions that align with the project's design philosophy and scope.

---

## Project Status

- **Current version:** V1 (Frozen)
- **Scope:** Deterministic manual-step → Playwright test generation
- **Audience:** QA engineers, test automation engineers, and teams migrating manual tests to Playwright
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

## Contributions

At this stage:

- Issues and feedback are welcome
- Feature direction is controlled by the repository owner
- Pull requests may not be accepted unless aligned with the project roadmap

This may change in later versions.

---

## Questions

If something feels ambiguous:
- Default to **not changing behavior**
- Document the question instead
- Revisit during a planned version bump
