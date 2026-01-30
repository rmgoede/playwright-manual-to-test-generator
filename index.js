import readline from 'readline';
import { generatePlaywrightTestFromSteps } from './generator.js';

async function main() {
  console.log("Paste your test steps below. Press ENTER on an empty line to generate:\n");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  let lines = [];

  rl.on('line', (line) => {
    if (line.trim() === '') {
      rl.close();
    } else {
      lines.push(line);
    }
  });

  rl.on('close', async () => {
    const steps = lines.join('\n');
    if (!steps.trim()) {
      console.log("No steps entered. Exiting.");
      process.exit(0);
    }

    try {
      const testCode = await generatePlaywrightTestFromSteps(steps);
      console.log("\n--- Generated Playwright Test ---\n");
      console.log(testCode);
      console.log("\n---------------------------------\n");
    } catch (err) {
      console.error("Error generating test:\n", err);
    }
  });
}

main();
