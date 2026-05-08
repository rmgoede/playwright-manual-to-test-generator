import { renderPlaywrightTestFromSchema } from "./renderer.js";

const schema = {
  test_name: "Full Snapshot Login Test",
  url: "https://www.saucedemo.com",
  snapshotPath: "./snapshots/saucedemo.html",
  steps: [
    { type: "action", action: "goto" },

    { type: "action", action: "fill", intent: "Username", value: "standard_user" },
    { type: "action", action: "fill", intent: "Password", value: "secret_sauce" },

    { type: "action", action: "click", value: "Login" }
  ]
};

const output = renderPlaywrightTestFromSchema(schema);

console.log(output);