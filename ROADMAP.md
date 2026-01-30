# Roadmap — Playwright Manual-to-Test Generator

This file is intentionally **private/internal**: strategy, packaging, and IP notes live here (not in the public README).

---

## Current State

✅ **V1 (Frozen / Locked) — DONE**
- Deterministic: manual steps (plain text) → **one** runnable Playwright **TypeScript** `.spec.ts`
- SauceDemo-specific rules intentionally baked in
- Validated scenarios are passing (see README)
- VS Code extension UI + core generator logic are stable

**Rule:** If it’s not explicitly supported, the output is allowed to fail.

---

## Versioning Model (You + Future Customers)

### V1 = Static prompt-only generator (current)
- No DOM inspection
- No scraping
- No auto-discovery
- No “smart” healing
- Primary value: predictable, boring, reliable output

### V1.5 = Offline DOM snapshot (next step)
Goal: improve selector accuracy **without** live browser control.

**Concept:** “Screen Scraper” / DOM snapshot capture tool
- Capture HTML snapshot (or simplified DOM) from a target page
- Feed that snapshot + manual steps into the generator
- Generator chooses better locators (still deterministic rules, but with richer context)

**Outputs:**
- Better selectors
- Fewer assumptions
- Still no live actions or runtime healing

### V2 = Live DOM + Playwright integration (bigger leap)
Goal: highest reliability and maintenance reduction.

**Concept:**
- Use Playwright itself to navigate, inspect, and validate selectors
- Auto-waiting, auto-screenshot-on-failure
- Optional “self-heal” attempts within strict boundaries

**Key risk:** scope explosion + complexity + harder to productize safely

---

## Packaging / Distribution Strategy

### Phase 1 (Now): Private repo + local use
- Keep repo private while you decide packaging/marketing
- Use README as “product spec”
- Use ROADMAP.md for strategy/IP notes
- Build confidence + demo assets

### Phase 2: Demo-safe public footprint (optional)
If you want something public without “giving away the farm,” options include:

**Option A: Public “Lite” + Private “Pro”**
- Public repo: README + demo video + maybe extension UI shell (no core generator logic)
- Private repo: full generator + prompt/rules + roadmap

**Option B: Public repo but gated features**
- Keep the repo public later, but:
  - Move the highest-value rules/prompts into a closed-source module
  - Or ship compiled artifacts only (not source) for paid users

**Option C: Keep it private until a buyer exists**
- Strongest IP control
- Harder to market (but demo video + screenshots solve most of that)

---

## VS Code Extension: Where This Can Live Long-Term

### Internal use (current)
- Running as an unpacked extension in VS Code (Extension Development Host)
- Great for iteration

### Packaged marketplace extension (later)
Yes, this can become a **searchable installed extension**:
- Publish to VS Code Marketplace (or Open VSX)
- Users install like any other extension
- Monetization is tricky on the marketplace itself (typically handled via licensing/keys or separate distribution)

**Note:** If you go paid, the extension usually becomes:
- UI + workflow tool
- Calls a licensed backend/service OR a locally licensed binary/module

---

## “Licensed Web App” Path (Internal Tool at Companies)

Yes, it can evolve into a licensed internal tool.

### Web app pros
- Easier license enforcement
- Central updates
- Team collaboration features (shared step libraries, templates, generated suite history)

### Web app cons
- Requires hosting, auth, billing, security posture
- Customers may not want to send internal test steps/URLs off-prem

### Likely enterprise-friendly approach
- Offer a **self-hosted** version (Docker)
- Or an “offline mode” that never sends data externally

### Anvil.works?
- Good for rapid internal-tool MVPs
- Not ideal for long-term enterprise scale or portability
- Fine for **prototype**, not the final architecture

---

## Monetization Notes (Not Final)

Potential models:
- Per-seat monthly
- Team license
- One-time license for “V1 Pro”
- Consulting + onboarding package
- Self-hosted enterprise license

---

## Next Concrete Moves (Choose One)

### Track 1 — Fast marketing proof (recommended)
1. Record 2–3 minute demo video:
   - paste steps → Generate → Save `.spec.ts` → Run → ✅ pass
2. Create a simple 1-page landing page (even GitHub Pages):
   - who it’s for + what it does + short demo clip
3. Talk to 3–5 target users (QA leads / SDETs) to validate demand

### Track 2 — Build V1.5 snapshot capture
- DOM snapshot tool + deterministic selector upgrade rules
- This is the best “value step” without full V2 complexity

---

## Internal Rules (Protect Scope)

- V1 is locked. Enhancements go to V1.5+ only.
- No silent feature creep.
- If it changes output behavior, update README + re-run validation suite.
- Strategy/IP talk stays in ROADMAP.md, not README.
