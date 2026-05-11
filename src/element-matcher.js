// src/element-matcher.js
// V1.9 Step 10B-3 — Generic scoring-based matching engine

export function findBestMatch(candidates, intent) {
  const normalizedIntent = normalize(intent);
  const interactiveCandidates = candidates.filter(isInteractiveCandidate);

  const checkboxMatch = findCheckboxMatch(
    interactiveCandidates,
    normalizedIntent
  );
  if (checkboxMatch) return checkboxMatch;
  
  const productAddToCartMatch = findProductAddToCartMatch(
    interactiveCandidates,
    normalizedIntent
  );
  if (productAddToCartMatch) return productAddToCartMatch;

  const scored = interactiveCandidates
    .map(candidate => ({
      candidate,
      score: scoreCandidate(candidate, normalizedIntent)
    }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored[0]?.candidate || null;
}

function scoreCandidate(candidate, normalizedIntent) {
  let score = 0;

  const text = normalize(candidate.text);
  const placeholder = normalize(candidate.placeholder);
  const testId = normalize(candidate.testId);
  const id = normalize(candidate.id);
  const name = normalize(candidate.name);
  const ariaLabel = normalize(candidate.ariaLabel);

  if (text === normalizedIntent) score += 100;
  if (placeholder === normalizedIntent) score += 95;
  if (testId === normalizedIntent) score += 90;
  if (id === normalizedIntent) score += 85;
  if (name === normalizedIntent) score += 80;
  if (ariaLabel === normalizedIntent) score += 80;

  if (text.includes(normalizedIntent)) score += 50;
  if (placeholder.includes(normalizedIntent)) score += 45;
  if (testId.includes(normalizedIntent)) score += 40;
  if (id.includes(normalizedIntent)) score += 35;
  if (name.includes(normalizedIntent)) score += 30;
  if (ariaLabel.includes(normalizedIntent)) score += 30;

  if (allIntentWordsMatch(normalizedIntent, testId)) score += 25;
  if (allIntentWordsMatch(normalizedIntent, id)) score += 25;
  if (allIntentWordsMatch(normalizedIntent, text)) score += 20;
  if (allIntentWordsMatch(normalizedIntent, placeholder)) score += 20;

  if (candidate.tag === "button") score += 5;
  if (candidate.tag === "input") score += 5;

  return score;
}

function allIntentWordsMatch(intent, value) {
  const words = intent
    .split(" ")
    .map(w => w.trim())
    .filter(Boolean);

  if (words.length === 0 || !value) return false;

  return words.every(word => value.includes(word));
}

function findCheckboxMatch(candidates, normalizedIntent) {
  const checkboxCandidates = candidates.filter(c =>
    c.tag === "input" &&
    normalize(c.type) === "checkbox"
  );

  if (checkboxCandidates.length === 0) {
    return null;
  }

  const wantsCheckbox =
    normalizedIntent.includes("checkbox") ||
    normalizedIntent.includes("check") ||
    normalizedIntent.includes("uncheck");

  if (!wantsCheckbox) {
    return null;
  }

  // Ordinal handling
  if (
    normalizedIntent.includes("checkbox 1") ||
    normalizedIntent.includes("first checkbox")
  ) {
    return checkboxCandidates[0] || null;
  }

  if (
    normalizedIntent.includes("checkbox 2") ||
    normalizedIntent.includes("second checkbox")
  ) {
    return checkboxCandidates[1] || null;
  }

  // Default to first checkbox if only one exists
  if (checkboxCandidates.length === 1) {
    return checkboxCandidates[0];
  }

  return checkboxCandidates[0] || null;
}

function findProductAddToCartMatch(candidates, normalizedIntent) {
  if (!normalizedIntent.includes("add") || !normalizedIntent.includes("cart")) {
    return null;
  }

  const productHint = normalizedIntent
    .replace("add", "")
    .replace("to", "")
    .replace("cart", "")
    .trim();

  if (!productHint) return null;

  return candidates.find(c => {
    const testId = normalize(c.testId);
    const id = normalize(c.id);
    const productWords = normalize(productHint).split(" ");

    return (
      testId.startsWith("add-to-cart-") &&
      productWords.every(word => testId.includes(word))
    ) || (
      id.startsWith("add-to-cart-") &&
      productWords.every(word => id.includes(word))
    );
  }) || null;
}

function isInteractiveCandidate(candidate) {
  return ["button", "a", "input", "textarea", "select"].includes(candidate.tag);
}

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}