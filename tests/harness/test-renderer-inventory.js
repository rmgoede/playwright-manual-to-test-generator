import { renderPlaywrightTestFromSchema } from "./renderer.js";

const schema = {
  test_name: "Snapshot Product-Specific Inventory Test",
  url: "https://www.saucedemo.com",
  steps: [
    { type: "action", action: "goto" },

    {
      type: "action",
      action: "fill",
      intent: "Username",
      value: "standard_user",
      snapshotPath: "./snapshots/saucedemo.html"
    },
    {
      type: "action",
      action: "fill",
      intent: "Password",
      value: "secret_sauce",
      snapshotPath: "./snapshots/saucedemo.html"
    },
    {
      type: "action",
      action: "click",
      value: "Login",
      snapshotPath: "./snapshots/saucedemo.html"
    },
    {
      type: "action",
      action: "click",
      value: "Add Bike Light to cart",
      snapshotPath: "./snapshots/saucedemo-inventory.html"
    }
  ]
};

const output = renderPlaywrightTestFromSchema(schema);

console.log(output);