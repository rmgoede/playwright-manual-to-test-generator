// src/selector-resolver.js
// V1.9 Step 4 — Selector Resolution

export function resolveSelector(candidate) {
  if (!candidate) return null;

  // 1. testId (highest priority)
  if (candidate.testId) {
    return {
      strategy: "testId",
      value: candidate.testId,
    };
  }

  // 2. id
  if (candidate.id) {
    return {
      strategy: "id",
      value: candidate.id,
    };
  }

  // 3. placeholder (inputs)
  if (candidate.placeholder) {
    return {
      strategy: "placeholder",
      value: candidate.placeholder,
    };
  }

  // 4. text (buttons/links)
  if (candidate.text) {
    return {
      strategy: "text",
      value: candidate.text,
    };
  }

  // 5. fallback css
  if (candidate.css) {
    return {
      strategy: "css",
      value: candidate.css,
    };
  }

  return null;
}