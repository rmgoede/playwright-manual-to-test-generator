// src/snapshot-parser.js
// V1.9 Step 1 — Snapshot Parsing Foundation

import fs from "fs";
import * as cheerio from "cheerio";

/**
 * Parse an HTML snapshot file and extract candidate UI elements
 * that may be used later for deterministic selector resolution.
 *
 * @param {string} snapshotPath
 * @returns {Array<object>}
 */
export function parseSnapshot(snapshotPath) {
  if (!snapshotPath || !fs.existsSync(snapshotPath)) {
    return [];
  }

  const html = fs.readFileSync(snapshotPath, "utf-8");
  const $ = cheerio.load(html);

  const candidates = [];

  $("button, a, input, textarea, select").each((_, el) => {
  const element = $(el);

  if (shouldIgnoreElement(el, element)) {
    return;
  }

  candidates.push({
    
      tag: el.tagName?.toLowerCase() || "",
      text: normalizeText(element.text()),
      role: element.attr("role") || null,
      testId: element.attr("data-testid") || element.attr("data-test") || null,
      id: element.attr("id") || null,
      name: element.attr("name") || null,
      type: element.attr("type") || null,
      placeholder: element.attr("placeholder") || null,
      ariaLabel: element.attr("aria-label") || null,
      href: element.attr("href") || null,
      css: buildCssCandidate(el, element),
    });
  });

  return candidates.filter(isUsefulCandidate);
}

function normalizeText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function isUsefulCandidate(candidate) {
  return Boolean(
    candidate.testId ||
      candidate.role ||
      candidate.id ||
      candidate.name ||
      candidate.placeholder ||
      candidate.ariaLabel ||
      candidate.text
  );
}
function shouldIgnoreElement(el, element) {
  const tag = el.tagName?.toLowerCase() || "";

  const ignoredTags = new Set(["svg", "path", "script", "style", "meta", "link"]);

  if (ignoredTags.has(tag)) {
    return true;
  }

  const text = normalizeText(element.text());
  const id = element.attr("id") || "";
  const testId = element.attr("data-testid") || element.attr("data-test") || "";

  const noisyTextValues = new Set([
    "New Conversation",
    "Upgrade Now",
    "Close modal",
  ]);

  if (noisyTextValues.has(text)) {
    return true;
  }

  if (
    id.startsWith("headlessui-") ||
    id.includes("ait-") ||
    testId.includes("headlessui")
  ) {
    return true;
  }

  return false;
}

function buildCssCandidate(el, element) {
  const tag = el.tagName?.toLowerCase() || "";

  if (element.attr("id")) {
    return `#${element.attr("id")}`;
  }

  if (element.attr("data-testid")) {
    return `[data-testid="${element.attr("data-testid")}"]`;
  }

  if (element.attr("data-test")) {
    return `[data-test="${element.attr("data-test")}"]`;
  }

  if (element.attr("name")) {
    return `${tag}[name="${element.attr("name")}"]`;
  }

  if (element.attr("placeholder")) {
    return `${tag}[placeholder="${element.attr("placeholder")}"]`;
  }

  return tag;
}