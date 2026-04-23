import fs from 'fs';
import { JSDOM } from 'jsdom';

export function loadSnapshot(snapshotPath) {
  const html = fs.readFileSync(snapshotPath, 'utf-8');
  const dom = new JSDOM(html);
  return dom.window.document;
}

function findByTestId(document, testId) {
  return document.querySelector(`[data-testid="${testId}"]`);
}

function findInputByLabel(document, labelText) {
  const labels = [...document.querySelectorAll('label')];
  const label = labels.find(
    l => l.textContent?.trim().toLowerCase() === labelText.toLowerCase()
  );

  if (!label) return null;

  const forId = label.getAttribute('for');
  if (!forId) return null;

  return document.getElementById(forId);
}

export function resolveField(document, { testId, label }) {
  if (testId) {
    const byTestId = findByTestId(document, testId);
    if (byTestId) {
      return {
        strategy: 'testId',
        value: testId,
        found: true,
      };
    }
  }

  if (label) {
    const byLabel = findInputByLabel(document, label);
    if (byLabel) {
      return {
        strategy: 'label',
        value: label,
        found: true,
      };
    }
  }

  return {
    strategy: null,
    value: null,
    found: false,
  };
}