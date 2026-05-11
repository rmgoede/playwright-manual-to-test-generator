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

  removeInjectedNoise($);

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

function removeInjectedNoise($) {
  // Remove known browser-extension injected containers/scripts.
  // This is generic snapshot hygiene, not application-specific logic.
  $('[src^="chrome-extension://"]').remove();
  $('[href^="chrome-extension://"]').remove();

  $('#aitopia').remove();
  $('[id*="aitopia"]').remove();
  $('[class*="aitopia"]').remove();
  $('[class^="ait-"]').remove();
  $('[class*=" ait-"]').remove();

  $('[id^="headlessui-"]').remove();
  $('[data-headlessui-state]').remove();
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
      candidate.text ||
      candidate.type === "checkbox" ||
      candidate.type === "radio"
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
  id.includes("aitopia") ||
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
  if (tag === "input" && element.attr("type")) {
  const parentFormId = element.closest("form").attr("id");

  if (parentFormId) {
    return `#${parentFormId} input[type="${element.attr("type")}"]`;
  }

  return `input[type="${element.attr("type")}"]`;
  }
  return tag;
}