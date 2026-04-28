/**
 * Semantic Mapper (V1.7)
 *
 * Purpose:
 * Convert generic test steps into element-aware Playwright actions + assertions.
 *
 * Why:
 * LLM output alone is not reliable for element-specific behavior.
 * This layer enforces deterministic mappings:
 *
 * checkbox → check/uncheck + toBeChecked
 * dropdown → selectOption + toHaveValue
 *
 * This improves:
 * - correctness
 * - reliability
 * - consistency of generated tests
 */

function normalizeText(value = '') {
  return String(value).toLowerCase().trim();
}

function inferElementType(step = {}) {
  const text = normalizeText(
    [
      step.action,
      step.assertion,
      step.target,
      step.description,
      step.value
    ].filter(Boolean).join(' ')
  );

  if (text.includes('checkbox')) return 'checkbox';
  if (text.includes('dropdown') || text.includes('select option') || text.includes('combobox')) return 'dropdown';
  // Do not infer "button" from click alone.
  // Many elements are clicked, including checkboxes, links, radios, and menu items.
  if (text.includes('button')) return 'button';

  return step.elementType || step.type || 'unknown';
}
function normalizeCheckboxSelector(selector) {
  if (!selector || selector.strategy !== 'css') return selector;

  const match = selector.value.match(/nth-of-type\((\d+)\)/);
  if (!match) return selector;

  const index = Number(match[1]) - 1;

  return {
    strategy: 'css',
    value: `#checkboxes input[type="checkbox"]`,
    index
  };
}

function mapSemanticStep(step = {}) {
  // Never remap navigation steps.
  // A URL or page name may contain words like "checkboxes" or "dropdown",
  // but goto must remain a page-level action.
  if (step.action === 'goto') {
    return step;
  }
  const elementType = inferElementType(step);
  const text = normalizeText(
    [
      step.action,
      step.assertion,
      step.target,
      step.description,
      step.value
    ].filter(Boolean).join(' ')
  );

  const mapped = {
    ...step,
    elementType
  };

    // Checkbox rules
  if (elementType === 'checkbox') {

  // Normalize selector to avoid fragile nth-of-type patterns
  mapped.selector = normalizeCheckboxSelector(step.selector);

if (mapped.assertion && mapped.assertion.selector) {
  mapped.assertion = {
    ...mapped.assertion,
    selector: normalizeCheckboxSelector(mapped.assertion.selector)
  };
}

  if (text.includes('uncheck') || text.includes('unchecked')) {
    if (step.type === 'action') {
      mapped.action = 'uncheck';
    }

    if (step.type === 'assertion' && mapped.assertion) {
      mapped.assertion = {
        ...mapped.assertion,
        method: 'not.toBeChecked',
        expected: true
      };
    }

    return mapped;
  }

  if (text.includes('check') || text.includes('checked')) {
    if (step.type === 'action') {
      mapped.action = 'check';
    }

    if (step.type === 'assertion' && mapped.assertion) {
      mapped.assertion = {
        ...mapped.assertion,
        method: 'toBeChecked',
        expected: true
      };
    }

    return mapped;
    }
  }

  // Button rules
  if (elementType === 'button') {
    mapped.action = 'click';
    mapped.selectorPriority = ['testId', 'role', 'css'];
    return mapped;
  }

  return mapped;
}

function mapSemanticSteps(schema = {}) {
  if (!schema || !Array.isArray(schema.steps)) {
    return schema;
  }

  return {
    ...schema,
    steps: schema.steps.map(mapSemanticStep)
  };
}

export {
  mapSemanticStep,
  mapSemanticSteps
};