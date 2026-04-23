import { loadSnapshot, resolveField } from './dom-snapshot-resolver.js';

function deriveLabelFromDescription(description) {
  if (!description) return null;

  const normalized = description.trim().toLowerCase();

  if (normalized.includes('username')) return 'Username';
  if (normalized.includes('password')) return 'Password';

  return null;
}

export function applyDomResolution(schemaJson, snapshotPath) {
  if (!snapshotPath) return schemaJson;

  const document = loadSnapshot(snapshotPath);

  const updatedSteps = schemaJson.steps.map(step => {
    if (!step.selector) return step;

    const fallbackLabel =
      step.selector.strategy === 'label'
        ? step.selector.value
        : deriveLabelFromDescription(step.description);

    const resolved = resolveField(document, {
      testId: step.selector.strategy === 'testId' ? step.selector.value : null,
      label: fallbackLabel,
    });

    if (resolved.found) {
      return {
        ...step,
        selector: {
          strategy: resolved.strategy,
          value: resolved.value,
        },
      };
    }

    return step;
  });

  return {
    ...schemaJson,
    steps: updatedSteps,
  };
}