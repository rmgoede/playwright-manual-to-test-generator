// src/snapshot-selector-pipeline.js
// V1.9 Step 6A — Snapshot selector pipeline wrapper

import { parseSnapshot } from "./snapshot-parser.js";
import { findBestMatch } from "./element-matcher.js";
import { resolveSelector } from "./selector-resolver.js";
import { buildLocator } from "./locator-builder.js";

export function resolveLocatorFromSnapshot(snapshotPath, intent) {
  const candidates = parseSnapshot(snapshotPath);
  const match = findBestMatch(candidates, intent);
  const selector = resolveSelector(match);
  const locator = buildLocator(selector);

  return {
    intent,
    match,
    selector,
    locator,
  };
}