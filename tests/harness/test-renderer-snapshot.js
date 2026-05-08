import { renderPlaywrightTestFromSchema } from "./renderer.js";

const schema = {
  test_name: "Backwards Compatibility Test",
  url: "https://www.saucedemo.com",
  snapshotPath: "./snapshots/saucedemo.html",
  steps: [
    {
      type: "action",
      action: "goto"
    },
    {
      type: "action",
      action: "fill",
      selector: { strategy: "css", value: "#user-name" },
      value: "standard_user"
    },
    {
      type: "action",
      action: "click",
      selector: { strategy: "css", value: "#login-button" },
      value: "Login"
    }
  ]
};

const output = renderPlaywrightTestFromSchema(schema);

console.log(output);