// src/locator-builder.js
// V1.9 Step 5 — Locator Builder

export function buildLocator(selector) {
  if (!selector) return null;

  const { strategy, value } = selector;

  switch (strategy) {
    case "testId":
      return `page.getByTestId("${value}")`;

    case "id":
      return `page.locator("#${value}")`;

    case "placeholder":
      return `page.getByPlaceholder("${value}")`;

    case "text":
      return `page.getByText("${value}")`;

    case "css":
      return `page.locator("${value}")`;

    default:
      return null;
  }
}